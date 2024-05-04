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
	async getAllBlogs() {
		try {
			return await BlogModel.find();
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

	async getBlogsByAccess(access: string) {
		try {
			if (access === "private") {
				return await BlogModel.find();
			} else if (access === "close-friends") {
				return await BlogModel.find({ access: { $ne: "private" } });
			} else {
				return await BlogModel.find({ access });
			}
		} catch (error) {
			throw new Error("Failed to fetch blogs");
		}
	}
}

export class Videos extends MongoDataSource<VideoDocument> {
	async getAllVideos() {
		try {
			return await VideoModel.find();
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

	async getVideosByAccess(access: string) {
		try {
			if (access === "private") {
				return await VideoModel.find();
			} else if (access === "close-friends") {
				return await VideoModel.find({ access: { $ne: "private" } });
			} else {
				return await VideoModel.find({ access });
			}
		} catch (error) {
			throw new Error("Failed to fetch videos");
		}
	}
}
