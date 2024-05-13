"use client";
import { Button } from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

export default function DownloadBlogButton({ blog }: { blog: any }) {
	const pathname = usePathname().split("/").pop();
	const onBlogDownload = () => {
		sendGAEvent({ event: "Blog Downloaded", value: blog.title });
	};

	const handleDownload = async () => {
		window.open(`https://${process.env.NEXT_PUBLIC_BUCKET}.s3.amazonaws.com/pdf/${blog.title}.pdf`);
		onBlogDownload();
	};
	return (
		<Button
			id={`download-${pathname}`}
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
				"&:hover": { backgroundColor: "#E50914", color: "white" }
			}}>
			Download PDF
		</Button>
	);
}
