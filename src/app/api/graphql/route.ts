import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import typeDefs from "@/graphql/schema";
import resolvers from "@/graphql/resolvers";
import { NextApiRequest } from "next";
import { Blogs, Videos } from "@/graphql/database/controllers";
import { BlogModel, VideoModel } from "@/graphql/database/models";
import mongoose from "mongoose";

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
	formatError: (formattedError, error) => {
		if (formattedError.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
			console.error("🔥", error);
		}
		return formattedError;
	}
});

const handler = startServerAndCreateNextHandler(apolloServer, {
	context: async (req: NextApiRequest) => {
		return {
			dataSources: {
				blogs: new Blogs({ modelOrCollection: BlogModel }),
				videos: new Videos({ modelOrCollection: VideoModel })
			}
		};
	}
});

export { handler as GET, handler as POST };
