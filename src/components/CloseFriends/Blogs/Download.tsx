"use client";
import { Button } from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";

export default function DownloadBlogButton({ blog }: { blog: any }) {
	const onBlogDownload = () => {
		// console.log("Blog downloaded");
		sendGAEvent({ event: "Blog Downloaded", value: blog.title });
		// window.close();
	};
	const handleDownload = async () => {
		const preview = window.open(`https://privatewebsitecontent.s3.amazonaws.com/pdf/${blog.title}.pdf`);
		onBlogDownload();
		// preview?.document.addEventListener("afterprint", event => onBlogDownload(preview!));
		// preview?.document.open();
		// if (preview) preview.document.title = blog.title;
		// preview?.document.write(blog.htmlContent);
		// preview?.focus();
		// preview?.print();
		// preview?.document.close();
	};
	return (
		<Button
			onClick={handleDownload}
			sx={{
				position: "fixed",
				top: 50,
				right: -2,
				padding: "10px 20px",
				border: "1.5px solid #E50914",
				borderTopLeftRadius: "30px",
				borderBottomLeftRadius: "30px",
				cursor: "pointer",
				zIndex: 1000,
				"&:hover": {
					backgroundColor: "#E50914",
					color: "white"
				}
			}}
		>
			Download PDF
		</Button>
	);
}
