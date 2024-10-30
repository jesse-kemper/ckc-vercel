import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Use JWT for storing session data
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Attempting login with:", credentials);

        // Retrieve the user by email, including location data
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          include: { location: true }, // Fetch the user's location
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        // Validate password
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Invalid password");
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          locationName: user.location?.locationName || null, // Include locationName
          locationId: user.location?.id || null, // Include locationId
        };
      },
    }),
  ],
  callbacks: {
    // Pass user data to the JWT callback to store in the token
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.locationName = user.locationName; // Add location to the token
        token.locationId = user.locationId; // Add location ID to the token
        
      }
      return token;
    },
    // Pass the token data to the session callback to set the session
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.locationName = token.locationName; // Add location to the session
        session.user.locationId = token.locationId; // Add location ID to the session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
