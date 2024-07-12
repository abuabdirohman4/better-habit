import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  //   pages: {
  //     signIn: "/auth/signin", // Custom sign in page
  //     signOut: "/auth/signout",
  //     error: "/auth/error", // Error code passed in query string as ?error=
  //     verifyRequest: "/auth/verify-request", // Email verification request
  //     newUser: "/auth/new-user", // Redirect new users to this page
  //   },
});
