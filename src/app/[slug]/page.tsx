// Markdown Imports
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { readFileSync } from "fs";

// Markdown Format Imports
import { Container, TableBody, TableFooter, TableHead, TableRow } from "@mui/material";
import { MarkdownH1, MarkdownH2, MarkdownH3, MarkdownH4 } from "@/components/Markdown/Markdown";
import { MarkdownLink, MarkdownCode, MarkdownImage, MarkdownListItem } from "@/components/Markdown/Markdown";
import { MarkdownParagraph, MarkdownButton, MarkdownTable, MarkdownTableCell } from "@/components/Markdown/Markdown";
import { MarkdownLabel, MarkdownUnderline } from "@/components/Markdown/Markdown";

// Static Page Imports
import pages, { routeToPage } from "@/utils/pages";
import { Metadata } from "next/types";
import { join } from "path";

type Props = { params: { slug: string } };

// Static Content Generation
export const dynamicParams = false;
export function generateStaticParams() {
	return pages.map(page => {
		return { slug: page.route };
	});
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
	return {
		title: `Pratyush | ${slug}`,
		description: routeToPage[params.slug].description,
		keywords: routeToPage[params.slug].keywords
	};
}

function getContent(page: string) {
	const filePath = join(process.cwd(), "public/readmes", `${page}.md`);
	const readmeContent = readFileSync(`${filePath}`, "utf8");
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
					label: MarkdownLabel,
					tbody: TableBody,
					th: MarkdownTableCell,
					tr: TableRow,
					td: MarkdownTableCell,
					tfoot: TableFooter,
					h1: MarkdownH1,
					h2: MarkdownH2,
					h3: MarkdownH3,
					h4: MarkdownH4,
					ins: MarkdownUnderline,
					li: MarkdownListItem,
					button: MarkdownButton
				}}
				remarkPlugins={[remarkGfm, remarkBreaks]}
				rehypePlugins={[rehypeRaw]}>
				{content}
			</ReactMarkdown>
		</Container>
	);
}
