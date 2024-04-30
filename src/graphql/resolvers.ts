const resolvers = {
	Query: {
		blogs: async (_: any, __: any, context: { dataSources: { blogs: any } }) => {
			try {
				return await context.dataSources.blogs.getAllBlogs();
			} catch (error) {
				console.error("Failed to fetch blogs:", error);
				throw new Error("Error fetching blogs.");
			}
		},

		videos: async (_: any, __: any, context: { dataSources: { videos: any } }) => {
			try {
				return await context.dataSources.videos.getAllVideos();
			} catch (error) {
				console.error("Failed to fetch videos:", error);
				throw new Error("Error fetching videos.");
			}
		}
	},

	Mutation: {
		createBlog: async (_: any, { input }: any, context: any) => {
			try {
				console.log("input:", input);
				return await context.dataSources.blogs.createBlog(input);
			} catch (error) {
				console.error("Failed to create blog:", error);
				throw new Error("Error creating blog.");
			}
		},
		createVideo: async (_: any, { input }: any, context: any) => {
			try {
				return await context.dataSources.videos.createVideo(input);
			} catch (error) {
				console.error("Failed to create video:", error);
				throw new Error("Error creating video.");
			}
		}
	}
};

export default resolvers;
