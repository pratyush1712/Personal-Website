import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export const closeFriendsEmails = new Set([
	"ps2245@cornell.edu",
	"pratyushsudhakar03@gmail.com",
	"atl82@cornell.edu",
	"ara227@cornell.edu",
	"mm2567@cornell.edu",
	"lnp35@cornell.edu",
	"vg245@cornell.edu",
	"jyk54@cornell.edu",
	"sv356@cornell.edu",
	"jxl9@cornell.edu"
]);

export const config = {
	pages: { signIn: "/login" },
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	callbacks: {
		async signIn({ user }) {
			if (closeFriendsEmails.has(user?.email!)) return true;
			return false;
		}
	},
	secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthOptions;

export function auth(
	...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
	return getServerSession(...args, config);
}
