import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import typeDefs from "@/graphql/schema";
import resolvers from "@/graphql/resolvers";
import { Blogs, Videos } from "@/graphql/database/controllers";
import { BlogModel, VideoModel } from "@/graphql/database/models";
import mongoose from "mongoose";
import { cookies, headers } from "next/headers";
import { decode } from "next-auth/jwt";

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
	try {
		if (uri) {
			await mongoose.connect(uri);
			console.log("🎉 connected to database successfully");
		}
	} catch (error) {
		console.error(error);
	}
};
connectDB();

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: process.env.NEXT_PUBLIC_VERCEL_ENV !== "production",
	csrfPrevention: true,
	formatError: (formattedError, error) => {
		if (formattedError.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
			console.error("🔥", error);
		}
		return formattedError;
	}
});

const handler = startServerAndCreateNextHandler(apolloServer, {
	context: async (req: Request) => {
		if (req.method === "POST") {
			const reqCookies = cookies().getAll();
			console.log(reqCookies);
			const cookieName = process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token";
			const token = reqCookies.find(cookie => cookie.name === "next-auth.session-token")?.value;
			const mutation = headers().get("Mutation") === "true";
			console.log(mutation);
			console.log(token);
			if (mutation) {
				console.log(`secret key ${process.env.NEXTAUTH_SECRET}`);
				const decoded = await decode({ token, secret: process.env.NEXTAUTH_SECRET! });
				console.log(decoded);
				if (decoded?.email! !== "pratyushsudhakar03@gmail.com") {
					throw new Error("You are not authorized to perform this action" + decoded?.email!);
				}
			}
		}
		return {
			dataSources: {
				blogs: new Blogs({ modelOrCollection: BlogModel }),
				videos: new Videos({ modelOrCollection: VideoModel })
			}
		};
	}
});

export { handler as GET, handler as POST };
