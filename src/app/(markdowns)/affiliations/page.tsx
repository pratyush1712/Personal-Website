import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Alert, Box, Chip, Container, Divider, Link, Paper, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight, materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white
	},
	[`&.${tableCellClasses.body}`]: { fontSize: 14 }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
	"&:last-child td, &:last-child th": { border: 0 }
}));

export const MarkdownLink = (props: any) => {
	return (
		<Link href={props.href} target="_blank" underline="hover">
			{props.children}
		</Link>
	);
};

export const MarkdownTable = (props: { children: any }): React.ReactElement => {
	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="a dense table">
				{props.children}
			</Table>
		</TableContainer>
	);
};

export const MarkdownTableCell = (props: any): React.ReactElement => {
	if (props.style && props.style.textAlign === "right") {
		return <StyledTableCell sx={{ textAlign: "right" }}>{props.children}</StyledTableCell>;
	} else {
		return <StyledTableCell>{props.children}</StyledTableCell>;
	}
};

export const MarkdownTableRow = (props: { children: any }) => {
	return <StyledTableRow>{props.children}</StyledTableRow>;
};

export const MarkdownCode = (props: any): React.ReactElement => {
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";
	if (props.inline) {
		return <Chip size="small" label={props.children?.toString()} />;
	} else if (props.className) {
		const language = props.className.split("-")[1];
		return (
			<SyntaxHighlighter language={language} style={isDarkMode ? materialDark : materialLight} PreTag="div" showLineNumbers={true}>
				{props.children.toString().trim()}
			</SyntaxHighlighter>
		);
	} else {
		return (
			<SyntaxHighlighter style={isDarkMode ? materialDark : materialLight} PreTag="div">
				{props.children}
			</SyntaxHighlighter>
		);
	}
};

export const MarkdownDivider = () => {
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";
	return <>{isDarkMode ? <Divider sx={{ bgcolor: "#393939" }} /> : <Divider sx={{ bgcolor: "#eeeeee" }} />}</>;
};

export const MarkdownH1 = (props: { children: any }) => {
	return (
		<>
			<Typography
				variant="h1"
				sx={{
					fontSize: "2em",
					display: "block",
					marginBlockStart: "0.67em",
					marginBlockEnd: "0.3em",
					fontWeight: "bold",
					lineHeight: 1.25
				}}
			>
				{props.children}
			</Typography>
			<MarkdownDivider />
		</>
	);
};

export const MarkdownH2 = (props: { children: any }) => {
	return (
		<>
			<Typography
				variant="h2"
				sx={{
					fontSize: "1.5em",
					display: "block",
					marginBlockStart: "0.83em",
					marginBlockEnd: "0.3em",
					fontWeight: "bold",
					lineHeight: 1.25
				}}
			>
				{props.children}
			</Typography>
			<MarkdownDivider />
		</>
	);
};

export const MarkdownBlockquote = (props: any): React.ReactElement => {
	return (
		<Box sx={{ borderLeft: 3, borderColor: "#eeeeee" }}>
			<blockquote>{props.children}</blockquote>
		</Box>
	);
};

// function MarkdownCheckbox(props: any) {
//   let checked = props.checked;
//   if (checked) {
//     return (
//       <FormControlLabel
//         disabled
//         control={<Checkbox defaultChecked />}
//         label={props.label}
//       />
//     );
//   } else {
//     return (
//       <FormControlLabel disabled control={<Checkbox />} label={props.label} />
//     );
//   }
// }

// function MarkdownImage(props: any) {
//   return <img src={props.src} alt={props.alt} />;
// }

export const MarkdownParagraph = (props: any): React.ReactElement => {
	const keyToCheck = "$$typeof";
	const exists = props.children.some((obj: { hasOwnProperty: (arg0: string) => any }) => obj.hasOwnProperty(keyToCheck));

	const isWarning =
		typeof props.children[0] === "string" && props.children[0].includes(":::") && props.children.slice(-1)[0].includes(":::");

	if (isWarning) {
		const severity = props.children[0].split(" ")[1];
		return (
			<Box
				sx={{
					display: "block",
					marginBlockStart: "1em",
					marginBlockEnd: "1em",
					marginInlineStart: "0px",
					marginInlineEnd: "0px"
				}}
			>
				<Alert severity={severity}>{props.children.slice(2, -1)}</Alert>
			</Box>
		);
	}
	if (exists) {
		return (
			<Box
				sx={{
					display: "block",
					marginBlockStart: "1em",
					marginBlockEnd: "1em",
					marginInlineStart: "0px",
					marginInlineEnd: "0px"
				}}
			>
				{props.children}
			</Box>
		);
	}
	return <p>{props.children}</p>;
};

async function getContent() {
	const res = await fetch("@/app/static/readmes/affiliations.md");
	return await res.text();
}

export default async function MDContainer() {
	const content = await getContent();
	return (
		<Container>
			<ReactMarkdown
				children={content}
				components={{
					code: MarkdownCode,
					a: MarkdownLink,
					p: MarkdownParagraph,
					// table: Markdowns.MarkdownTable,
					// thead: TableHead,
					// tbody: TableBody,
					th: MarkdownTableCell,
					// tr: Markdowns.MarkdownTableRow,
					td: MarkdownTableCell,
					// tfoot: TableFooter,
					// h1: Markdowns.MarkdownH1,
					// h2: Markdowns.MarkdownH2,
					hr: MarkdownDivider,
					// br: MarkdownBr,
					// input: MarkdownCheckbox,
					// img: MarkdownImage,
					blockquote: MarkdownBlockquote
				}}
				remarkPlugins={[remarkGfm, remarkBreaks]}
				rehypePlugins={[rehypeRaw]}
			/>
		</Container>
	);
}
