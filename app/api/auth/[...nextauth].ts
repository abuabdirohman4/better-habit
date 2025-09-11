import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user && token?.sub) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
    //   pages: {
    //     signIn: "/auth/signin", // Custom sign in page
    //     signOut: "/auth/signout",
    //     error: "/auth/error", // Error code passed in query string as ?error=
    //     verifyRequest: "/auth/verify-request", // Email verification request
    //     newUser: "/auth/new-user", // Redirect new users to this page
    //   },
});
