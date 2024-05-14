import { gql } from "@apollo/client";

export const GET_CONTENTS = gql`
	query GetContents($access: String! = "private", $offset: Int = 0, $limit: Int) {
		accessContents(access: $access, offset: $offset, limit: $limit) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
		}
	}
`;

export const GET_BLOG = gql`
	query GetBlog($id: ID!) {
		blog(id: $id) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			htmlContent
		}
	}
`;

export const GET_VIDEO = gql`
	query GetVideo($id: ID!) {
		video(id: $id) {
			id
			title
			details
			image
			access
			createdAt
			updatedAt
			keywords
			tags
			videoUrl
		}
	}
`;

export const GET_BLOGS = gql`
	query GetBlogs($offset: Int = 0, $limit: Int) {
		blogs(offset: $offset, limit: $limit) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			htmlContent
		}
	}
`;

export const DELETE_BLOG_MUTATION = gql`
	mutation DeleteBlog($id: ID!) {
		deleteBlog(id: $id) {
			id
		}
	}
`;

export const GET_VIDEOS = gql`
	query GetVideos($offset: Int = 0, $limit: Int) {
		videos(offset: $offset, limit: $limit) {
			id
			title
			details
			image
			access
			createdAt
			updatedAt
			keywords
			tags
		}
	}
`;

export const DELETE_VIDEO_MUTATION = gql`
	mutation DeleteVideo($id: ID!) {
		deleteVideo(id: $id) {
			id
		}
	}
`;
