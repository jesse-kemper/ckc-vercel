import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt-ts";
import { SessionStrategy } from "next-auth";
import { Session } from "next-auth";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "jwt" as SessionStrategy, // Use JWT for storing session data
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
          if(credentials){
            console.log("Creds found");
          let pw = await hash(credentials?.password, 10);
          console.log(pw);
        }
          // Retrieve the user by email, including location data
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email }
          });
  
          if (!user) {
            console.log("User not found");
            return null;
          }
  
          // Validate password
          const isValid = user.password && credentials?.password ? await compare(credentials.password, user.password) : false;
          if (!isValid) {
            console.log("Invalid password");
            return null;
          }
  
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      }),
    ],
    callbacks: {
      // Pass user data to the JWT callback to store in the token
      jwt: async ({ token, user }: { token: any, user?: any }) => {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          
        }
        return token;
      },
      // Pass the token data to the session callback to set the session
      session: async ({ session, token }: { session: any, token: any }) => {
        if (session?.user) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
        }
        return session;
      },
    },
  };
  