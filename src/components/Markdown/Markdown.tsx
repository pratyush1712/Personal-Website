import { Button, Chip, Container, Divider, Link, ListItem, Paper, Typography } from "@mui/material";
import { Table, TableCell, TableContainer } from "@mui/material";
import { BiSolidHandRight } from "react-icons/bi";
import Icon from "@/components/Markdown/CustomIcon";
import Image from "next/image";

export function MarkdownLink(props: any) {
	return (
		<Link href={props.href} target="_blank" underline="hover" display="inline">
			{props.children}
		</Link>
	);
}

export function MarkdownTable(props: any) {
	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="a dense table">
				{props.children}
			</Table>
		</TableContainer>
	);
}

export function MarkdownTableCell(props: any) {
	return (
		<TableCell>
			{props.children}
			{/* <Typography>{props.children}</Typography> */}
		</TableCell>
	);
}

export function MarkdownList(props: any) {
	return <Typography>{props.children}</Typography>;
}

export function MarkdownListItem(props: any) {
	return (
		<ListItem>
			<BiSolidHandRight />
			<Container>{props.children}</Container>
		</ListItem>
	);
}

export function MarkdownButton(props: any) {
	return (
		<Button style={props.style} type="submit">
			{props.children}
		</Button>
	);
}

export function MarkdownCode(props: any) {
	return <Chip size="small" label={props.children?.toString()} sx={{ borderRadius: 1, my: 0.2 }} />;
}

export function MarkdownH1(props: any) {
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
				}}>
				{props.children}
			</Typography>
			<Divider sx={{ mb: 1.5 }} />
		</>
	);
}

export function MarkdownH2(props: any) {
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
				}}>
				{props.children}
			</Typography>
			<Divider sx={{ mb: 1 }} />
		</>
	);
}

export function MarkdownH3(props: any) {
	return (
		<>
			<Typography
				variant="h3"
				sx={{
					fontSize: "1.25em",
					display: "block",
					marginBlockStart: "0.83em",
					marginBlockEnd: "0.3em",
					fontWeight: "bold",
					lineHeight: 1.25
				}}>
				{props.children}
			</Typography>
		</>
	);
}

export function MarkdownH4(props: any) {
	return (
		<>
			<Typography
				variant="h4"
				sx={{
					fontSize: "1em",
					display: "block",
					marginBlockStart: "0.67em",
					marginBlockEnd: "0.3em",
					fontWeight: "bold",
					lineHeight: 1.25
				}}>
				{props.children}
			</Typography>
		</>
	);
}

export function MarkdownItalic(props: any) {
	return (
		<Typography variant="inherit">
			<i>{props.children}</i>
		</Typography>
	);
}

export function MarkdownUnderline(props: any) {
	return (
		<Typography variant="inherit">
			<u>{props.children}</u>
		</Typography>
	);
}

export function MarkdownImage(props: any) {
	props.style.width = props.style.width?.split("px")[0] || "15";
	props.style.height = props.style.height?.split("px")[0] || "25";
	if (props?.className === "overview") {
		return <Icon component="img" src={props.src} />;
	}
	return <Image {...props} width={props.style.width} height={props.style.height} alt={props?.alt || ""} />;
}

export const MarkdownLabel = (props: any) => {
	return (
		<Typography variant="body1" display="block" gutterBottom>
			{props.children}
		</Typography>
	);
};

export function MarkdownParagraph(props: any) {
	if (!props.children) return <Typography>{props.children}</Typography>;

	const element: any = props.children;
	const result = [];

	let anyInlineElement = false;
	for (const e of element) {
		if (e.type) {
			anyInlineElement = true;
		}
	}

	if (anyInlineElement) {
		for (const e of element) {
			if (e.type) {
				const uniqueID = `${e.key} ${Math.random()}`;
				if (e.type === "strong") {
					result.push(
						<Typography key={uniqueID} display="inline" mb={1}>
							<strong>{e}</strong>
						</Typography>
					);
				} else if (e.type === "em") {
					result.push(
						<Typography key={uniqueID} display="inline" mb={1}>
							<i>{e}</i>
						</Typography>
					);
				} else {
					result.push({ ...e });
				}
			} else {
				const uniqueID = `${e.key} ${Math.random()}`;
				result.push(
					<Typography key={uniqueID} display="inline" mb={1}>
						{e}
					</Typography>
				);
			}
		}
	} else {
		for (const e of element) {
			const uniqueID = `${e.key} ${Math.random()}`;
			if (e.type) {
				result.push({ ...e });
			} else {
				result.push(
					<Typography key={uniqueID} mb={2}>
						{e}
					</Typography>
				);
			}
		}
	}
	return <>{result}</>;
}
