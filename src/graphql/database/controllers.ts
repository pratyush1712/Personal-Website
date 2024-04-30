import { BlogModel, VideoModel } from "./models";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongodb";

export interface BlogDocument {
	_id: ObjectId;
	title: string;
	details: string;
	image: string;
	createdAt: string;
	keywords: string[];
	tags: string[];
	htmlContent: string;
}

export interface VideoDocument {
	_id: ObjectId;
	title: string;
	details: string;
	image: string;
	createdAt: string;
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
			console.log("controller input:", input);
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
}