// Markdown Imports
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { readFileSync } from "fs";

// Markdown Format Imports
import { Container, TableBody, TableFooter, TableHead, TableRow } from "@mui/material";
import { MarkdownH1, MarkdownH2, MarkdownCode, MarkdownImage, MarkdownLink, MarkdownList, MarkdownListItem } from "@/lib/markdown";
import { MarkdownParagraph, MarkdownStrong, MarkdownTable, MarkdownTableCell } from "@/lib/markdown";

// Static Page Imports
import pages, { routeToPage } from "@/lib/pages";
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
		description: routeToPage[params.slug].description
	};
}

function getContent(page: string) {
	const readmeContent = readFileSync(`public/readmes/${page}.md`, "utf8");
	return (
		<ReactMarkdown
			children={readmeContent}
			components={{
				code: MarkdownCode,
				a: MarkdownLink,
				p: MarkdownParagraph,
				table: MarkdownTable,
				thead: TableHead,
				tbody: TableBody,
				th: MarkdownTableCell,
				tr: TableRow,
				td: MarkdownTableCell,
				tfoot: TableFooter,
				h1: MarkdownH1,
				h2: MarkdownH2
			}}
			remarkPlugins={[remarkGfm, remarkBreaks]}
			rehypePlugins={[rehypeRaw]}
		/>
	);
}

export default async function MDContainer({ params }: Props) {
	const content = getContent(params.slug);
	return (
		<Container maxWidth="md" sx={{ pb: 1, minWidth: "100%" }}>
			{content}
		</Container>
	);
}
