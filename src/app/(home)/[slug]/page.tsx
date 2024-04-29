// Markdown Imports
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { readFileSync } from "fs";

// Markdown Format Imports
import { Container, TableBody, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import {
	MarkdownH1,
	MarkdownH2,
	MarkdownCode,
	MarkdownImage,
	MarkdownLink,
	MarkdownList,
	MarkdownListItem,
	MarkdownH3
} from "@/components/Markdown";
import { MarkdownParagraph, MarkdownTable, MarkdownTableCell } from "@/components/Markdown";

// Static Page Imports
import pages, { routeToPage } from "@/utils/pages";
import { Metadata, ResolvingMetadata } from "next/types";

type Props = { params: { slug: string } };

// Static Content Generation
export const dynamicParams = false;
export function generateStaticParams() {
	return pages.map(page => {
		return { slug: page.route };
	});
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const slug = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
	return {
		title: `Pratyush | ${slug}`,
		description: routeToPage[params.slug].description,
		keywords: routeToPage[params.slug].keywords
	};
}

function getContent(page: string) {
	const readmeContent = readFileSync(`public/readmes/${page}.md`, "utf8");
	return readmeContent;
}

export default async function MDContainer({ params }: Props) {
	const content = getContent(params.slug);
	return (
		<Container maxWidth="md" sx={{ pb: 1, minWidth: "100%" }}>
			<ReactMarkdown
				components={{
					code: MarkdownCode,
					a: MarkdownLink,
					p: MarkdownParagraph,
					table: MarkdownTable,
					img: MarkdownImage,
					thead: TableHead,
					tbody: TableBody,
					th: MarkdownTableCell,
					tr: TableRow,
					td: MarkdownTableCell,
					tfoot: TableFooter,
					h1: MarkdownH1,
					h2: MarkdownH2,
					h3: MarkdownH3,
					li: MarkdownListItem
				}}
				remarkPlugins={[remarkGfm, remarkBreaks]}
				rehypePlugins={[rehypeRaw]}
			>
				{content}
			</ReactMarkdown>
		</Container>
	);
}
