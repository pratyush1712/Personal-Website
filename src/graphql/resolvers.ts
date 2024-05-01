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

		blog: async (_: any, { id }: any, context: { dataSources: { blogs: any } }) => {
			try {
				return await context.dataSources.blogs.getBlogById(id);
			} catch (error) {
				console.error("Failed to fetch blog:", error);
				throw new Error("Error fetching blog.");
			}
		},

		videos: async (_: any, __: any, context: { dataSources: { videos: any } }) => {
			try {
				return await context.dataSources.videos.getAllVideos();
			} catch (error) {
				console.error("Failed to fetch videos:", error);
				throw new Error("Error fetching videos.");
			}
		},

		video: async (_: any, { id }: any, context: { dataSources: { videos: any } }) => {
			try {
				return await context.dataSources.videos.getVideoById(id);
			} catch (error) {
				console.error("Failed to fetch video:", error);
				throw new Error("Error fetching video.");
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
		},

		updateBlog: async (_: any, { id, input }: any, context: any) => {
			try {
				return await context.dataSources.blogs.updateBlog(id, input);
			} catch (error) {
				console.error("Failed to update blog:", error);
				throw new Error("Error updating blog.");
			}
		},

		deleteBlog: async (_: any, { id }: any, context: any) => {
			try {
				return await context.dataSources.blogs.deleteBlog(id);
			} catch (error) {
				console.error("Failed to delete blog:", error);
				throw new Error("Error deleting blog.");
			}
		}
	}
};

export default resolvers;
