import { Content } from "@/types";
import { useQuery, gql } from "@apollo/client";
import { Button, Typography } from "@mui/material";
import Link from "next/link";

const GET_BLOGS = gql`
	query GetBlogs {
		blogs {
			id
			title
			details
			image
			createdAt
			keywords
			tags
			htmlContent
		}
	}
`;

const CREATE_BLOG_MUTATION = gql`
	mutation CreateBlog($input: NewBlogInput!) {
		createBlog(input: $input) {
			id
			title
			details
			image
			createdAt
			keywords
			tags
			htmlContent
		}
	}
`;

export default function BlogList() {
	const { data, loading, error } = useQuery(GET_BLOGS);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error fetching blogs: {error.message}</p>;

	const currentUrl = window.location.href;

	return (
		<div>
			<Typography variant="h4" sx={{ mb: 4 }}>
				All Blogs
			</Typography>
			{data.blogs.map((blog: Content) => (
				<div key={blog.id}>
					<Typography variant="h6">{blog.title}</Typography>
					<Link href={`${currentUrl}/blogs/${blog.id}`} passHref>
						<Button variant="contained">View/Edit</Button>
					</Link>
				</div>
			))}
		</div>
	);
}
