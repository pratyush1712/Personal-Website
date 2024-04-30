const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
	title: { type: String, required: [true, "Title is required"] },
	details: { type: String, required: [true, "Details are required"] },
	image: { type: String, required: [true, "Image URL is required"] },
	createdAt: { type: String, required: [true, "Creation date is required"] },
	keywords: [{ type: String, required: [true, "At least one keyword is required"] }],
	tags: [{ type: String, required: [true, "At least one tag is required"] }],
	htmlContent: { type: String, required: [true, "HTML content is required"] }
});

const videoSchema = new Schema({
	title: { type: String, required: [true, "Title is required"] },
	details: { type: String, required: [true, "Details are required"] },
	image: { type: String, required: [true, "Image URL is required"] },
	createdAt: { type: String, required: [true, "Creation date is required"] },
	keywords: [{ type: String, required: [true, "At least one keyword is required"] }],
	tags: [{ type: String, required: [true, "At least one tag is required"] }],
	videoUrl: { type: String, required: [true, "Video URL is required"] }
});

const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
const VideoModel = mongoose.models.Video || mongoose.model("Video", videoSchema);

export { BlogModel, VideoModel };
