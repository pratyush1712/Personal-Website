import { Chip, Container, Divider, Link, ListItem, Paper, Typography, Icon } from "@mui/material";
import { Table, TableCell, TableContainer } from "@mui/material";
import { usePathname } from "next/navigation";
import { BiSolidHandRight, BiSolidRightArrow } from "react-icons/bi";
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
				}}
			>
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
				}}
			>
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
				}}
			>
				{props.children}
			</Typography>
		</>
	);
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
	return <Image {...props} />;
}

export function MarkdownParagraph(props: any) {
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
				if (e.type === "strong") {
					result.push(
						<Typography key={e} display="inline" mb={1}>
							<strong>{e}</strong>
						</Typography>
					);
				} else if (e.type === "em") {
					result.push(
						<Typography key={e} display="inline" mb={1}>
							<i>{e}</i>
						</Typography>
					);
				} else {
					result.push({ ...e });
				}
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
