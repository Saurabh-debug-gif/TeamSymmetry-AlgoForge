import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    callbacks: {
        // ✅ Sirf JWT mein ek baar call karo
        async jwt({ token, account, user }) {
            if (account?.provider === "google") {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name: user.name,
                                email: user.email,
                                googleId: account.providerAccountId,
                            }),
                        }
                    );
                    const data = await res.json();
                    token.backendToken = data.token;
                    token.role = data.role;
                } catch (err) {
                    console.error("Google login error:", err);
                }
            }
            return token;
        },

        async session({ session, token }) {
            session.backendToken = token.backendToken;
            session.role = token.role;
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },
});

export { handler as GET, handler as POST };