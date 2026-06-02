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
import { MarkdownItalic, MarkdownLabel, MarkdownUnderline, MarkdownBold } from "@/components/Markdown/Markdown";
import MarkdownSearchHighlighter from "@/components/Markdown/MarkdownSearchHighlighter";

// Static Page Imports
import pages, { routeToPage } from "@/utils/pages";
import { Metadata } from "next/types";
import { join } from "path";
import Script from "next/script";

type Props = { params: Promise<{ slug: string }> };

// Static Content Generation
export const dynamicParams = false;
export function generateStaticParams() {
	const params = pages.filter(page => page.route !== "brain").map(page => ({ slug: page.route }));
	return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const title = `Pratyush | ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
	return {
		title: title,
		description: routeToPage[slug].description,
		keywords: routeToPage[slug].keywords
	};
}

function getContent(page: string) {
	const filePath = join(process.cwd(), "public/readmes", `${page}.md`);
	const readmeContent = readFileSync(`${filePath}`, "utf8");
	return readmeContent;
}

export default async function MDContainer({ params }: Props) {
	const { slug } = await params;
	const content = getContent(slug);
	return (
		<Container id="portfolio-markdown-content" maxWidth="md" sx={{ pb: 1, minWidth: "100%" }}>
			<MarkdownSearchHighlighter contentId="portfolio-markdown-content" />
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
					strong: MarkdownBold,
					em: MarkdownItalic,
					ins: MarkdownUnderline,
					li: MarkdownListItem,
					button: MarkdownButton
				}}
				remarkPlugins={[remarkGfm, remarkBreaks]}
				rehypePlugins={[rehypeRaw]}>
				{content}
			</ReactMarkdown>
			<Script
				id="mermaid"
				type="module"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs";
        mermaid.initialize({startOnLoad: true});
        mermaid.contentLoaded();`
				}}
			/>
		</Container>
	);
}
