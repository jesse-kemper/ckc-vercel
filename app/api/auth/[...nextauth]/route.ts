import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../prisma/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { authOptions } from "app/lib/authOptions";


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
