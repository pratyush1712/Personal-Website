import { BlogModel, VideoModel } from "./models";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongodb";

export interface BlogDocument {
	_id: ObjectId;
	title: string;
	details: string;
	access?: string;
	image: string;
	createdAt: string;
	updatedAt?: string;
	keywords: string[];
	tags: string[];
	htmlContent: string;
}

export interface VideoDocument {
	_id: ObjectId;
	title: string;
	details: string;
	access?: string;
	image: string;
	createdAt: string;
	updatedAt?: string;
	keywords: string[];
	tags: string[];
	videoUrl: string;
}

export class Blogs extends MongoDataSource<BlogDocument> {
	async fetchBlogs(params: any, offset?: number, limit?: number) {
		try {
			if (offset !== undefined || limit !== undefined) {
				const data = await BlogModel.find(params)
					.skip(offset)
					.limit(limit === 0 ? 1 : limit);
				if (limit === 0) return [];
				return data;
			}
			return await BlogModel.find(params);
		} catch (error) {
			throw new Error("Failed to fetch videos");
		}
	}

	async getAllBlogs(offset?: number, limit?: number) {
		try {
			return await this.fetchBlogs({}, offset, limit);
		} catch (error) {
			throw new Error("Failed to fetch blogs");
		}
	}

	async createBlog(input: BlogDocument) {
		try {
			return await BlogModel.create(input);
		} catch (error) {
			console.error("Failed to create blog:", error);
			throw new Error("Failed to create blog");
		}
	}

	async getBlogById(id: string) {
		try {
			return await BlogModel.findById(id);
		} catch (error) {
			throw new Error("Failed to fetch blog");
		}
	}

	async updateBlog(id: string, input: BlogDocument) {
		try {
			return await BlogModel.findByIdAndUpdate(id, input, { new: true });
		} catch (error) {
			throw new Error("Failed to update blog");
		}
	}

	async deleteBlog(id: string) {
		try {
			return await BlogModel.findByIdAndDelete(id);
		} catch (error) {
			throw new Error("Failed to delete blog");
		}
	}

	async getBlogsByAccess(access: string, offset?: number, limit?: number) {
		try {
			if (access === "private") {
				return await this.fetchBlogs({}, offset, limit);
			} else if (access === "close-friends") {
				return await this.fetchBlogs({ access: { $ne: "private" } }, offset, limit);
			} else {
				return await this.fetchBlogs({ access }, offset, limit);
			}
		} catch (error) {
			throw new Error("Failed to fetch blogs");
		}
	}
}

export class Videos extends MongoDataSource<VideoDocument> {
	async fetchVideos(params: any, offset?: number, limit?: number) {
		try {
			if (offset !== undefined || limit !== undefined) {
				const data = await VideoModel.find(params)
					.skip(offset)
					.limit(limit === 0 ? 1 : limit);
				if (limit === 0) return [];
				return data;
			}
			return await VideoModel.find(params);
		} catch (error) {
			throw new Error("Failed to fetch videos");
		}
	}

	async getAllVideos(offset?: number, limit?: number) {
		try {
			return await this.fetchVideos({}, offset, limit);
		} catch (error) {
			throw new Error("Failed to fetch videos");
		}
	}

	async createVideo(input: VideoDocument) {
		try {
			return await VideoModel.create(input);
		} catch (error) {
			throw new Error("Failed to create video");
		}
	}

	async getVideoById(id: string) {
		try {
			return await VideoModel.findById(id);
		} catch (error) {
			throw new Error("Failed to fetch video");
		}
	}

	async updateVideo(id: string, input: VideoDocument) {
		try {
			return await VideoModel.findByIdAndUpdate(id, input, { new: true });
		} catch (error) {
			throw new Error("Failed to update video");
		}
	}

	async deleteVideo(id: string) {
		try {
			return await VideoModel.findByIdAndDelete(id);
		} catch (error) {
			throw new Error("Failed to delete video");
		}
	}

	async getVideosByAccess(access: string, offset?: number, limit?: number) {
		try {
			if (access === "private") {
				return await this.fetchVideos({}, offset, limit);
			} else if (access === "close-friends") {
				return await this.fetchVideos({ access: { $ne: "private" } }, offset, limit);
			} else {
				return await this.fetchVideos({ access }, offset, limit);
			}
		} catch (error) {
			throw new Error("Failed to fetch videos");
		}
	}
}
