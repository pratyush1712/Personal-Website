import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const validEmails = new Set(["ps2245@cornell.edu", "pratyushsudhakar03@gmail.com"]);

const handler = NextAuth({
	pages: {
		signIn: "/login"
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	callbacks: {
		async signIn({ user }) {
			if (validEmails.has(user?.email!)) return true;
			return false;
		}
	},
	secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
