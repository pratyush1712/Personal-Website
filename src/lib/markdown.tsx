import { Chip, Container, Divider, Link, List, ListItem, Paper, Typography, Icon } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function MarkdownLink(props: any) {
	return (
		<Link href={props.href} target="_blank" underline="hover">
			{props.children}
		</Link>
	);
}

export function MarkdownTable(props: { children: ReactNode }) {
	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="a dense table">
				{props.children}
			</Table>
		</TableContainer>
	);
}

export function MarkdownTableCell(props: { children: ReactNode }) {
	return (
		<TableCell>
			{props.children}
			{/* <Typography>{props.children}</Typography> */}
		</TableCell>
	);
}

export function MarkdownList(props: { children: ReactNode }) {
	return <Typography>{props.children}</Typography>;
}

export function MarkdownListItem(props: { children: ReactNode }) {
	return <Typography>&#10147; {props.children}</Typography>;
}

export function MarkdownCode(props: { children: ReactNode }) {
	return <Chip size="small" label={props.children?.toString()} sx={{ borderRadius: 1 }} />;
}

export function MarkdownH1(props: { children: ReactNode }) {
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
			<Divider sx={{ mb: 1.5 }} />
		</>
	);
}

export function MarkdownH2(props: { children: ReactNode }) {
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
			<Divider sx={{ mb: 1 }} />
		</>
	);
}

export function MarkdownStrong(props: { children: ReactNode }) {
	return <Typography>{props.children}</Typography>;
}

export function MarkdownImage(props: any) {
	const pathname = usePathname();
	const sendOutbound = (event: any) => {
		// ReactGA.event({
		// 	category: "ND",
		// 	action: "Clicked on Link",
		// 	label: "ND Video"
		// });
	};

	if (pathname.substring(1, pathname.length) === "overview") {
		return <Icon component="img" src={require(`${props.src}`)} onClick={sendOutbound} />;
	}
	return <img {...props} />;
}

export function MarkdownParagraph(props: { children: ReactNode }) {
	if (!props.children) return <Typography>{props.children}</Typography>;

	const element: any = props.children;
	let result = [];

	let anyInlineElement = false;
	for (let e of element) {
		if (e.type) {
			anyInlineElement = true;
		}
	}

	if (anyInlineElement) {
		for (let e of element) {
			if (e.type) {
				result.push({ ...e });
			} else {
				result.push(
					<Typography key={e} display="inline" mb={1}>
						{e}
					</Typography>
				);
			}
		}
	} else {
		for (let e of element) {
			if (e.type) {
				result.push({ ...e });
			} else {
				result.push(
					<Typography key={e} mb={2}>
						{e}
					</Typography>
				);
			}
		}
	}
	return <>{result}</>;
}
