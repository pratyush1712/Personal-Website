"use client";
import { Button, Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import { VscMarkdown, VscChromeClose } from "react-icons/vsc";
import { useTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
import { TOKENS } from "@/ui/Theme";

interface Props {
	pages: {
		index: number;
		name: string;
		route: string;
	}[];
	selectedIndex: number;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	setCurrentComponent: React.Dispatch<React.SetStateAction<string>>;
	visiblePageIndexs: number[];
	setVisiblePageIndexs: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AppButtons({
	pages,
	selectedIndex,
	setSelectedIndex,
	setCurrentComponent,
	visiblePageIndexs,
	setVisiblePageIndexs
}: Props) {
	const theme = useTheme();
	const t = theme.palette.mode === "dark" ? TOKENS.dark : TOKENS.light;

	function renderPageButton(index: number, name: string, route: string) {
		const active = selectedIndex === index;
		return (
			<Link href={route} key={index}>
				<Box sx={{ display: "inline-block", borderRight: `1px solid ${t.border}` }}>
					<Button
						disableRipple
						disableElevation
						disableFocusRipple
						aria-current={active ? "page" : undefined}
						onClick={() => {
							setSelectedIndex(index);
							setCurrentComponent("button");
						}}
						sx={{
							borderRadius: 0,
							px: 1.75,
							height: "33px",
							minHeight: "33px",
							py: 0,
							textTransform: "none",
							fontSize: "0.8rem",
							// Active tab matches the editor surface with a thin accent on top; inactive tabs
							// recede into the panel-colored tab strip.
							backgroundColor: active ? t.surface : t.panel,
							color: active ? t.textPrimary : t.textSecondary,
							borderTop: "1px solid",
							borderTopColor: active ? t.accent : "transparent",
							"&.MuiButtonBase-root:hover": {
								backgroundColor: active ? t.surface : t.elevated,
								color: t.textPrimary
							},
							transition: "none"
						}}>
						<Box component="span" sx={{ display: "inline-flex", color: t.textSecondary, mr: 0.6 }}>
							<VscMarkdown />
						</Box>
						{name}
						<Box
							component="span"
							role="button"
							aria-label={`Close ${name}`}
							sx={{
								ml: 1,
								mr: -0.75,
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								width: 18,
								height: 18,
								borderRadius: 0.5,
								color: "inherit",
								"&:hover": { backgroundColor: t.elevated, color: t.textPrimary }
							}}
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								e.stopPropagation();
								setVisiblePageIndexs(visiblePageIndexs.filter(x => x !== index));
							}}>
							<VscChromeClose size={12} />
						</Box>
					</Button>
				</Box>
			</Link>
		);
	}

	return (
		<Container
			maxWidth={false}
			disableGutters
			sx={{
				display: "inline-block",
				overflowX: "hidden",
				":hover": { overflowX: "auto" },
				overflowY: "hidden",
				whiteSpace: "nowrap",
				minHeight: "33px",
				backgroundColor: pages.length !== 0 ? t.panel : "transparent",
				borderBottom: pages.length !== 0 ? `1px solid ${t.border}` : "none",
				scrollbarWidth: "thin",
				scrollbarColor: `${t.border} ${t.panel}`
			}}>
			{pages.map(({ index, name, route }) => renderPageButton(index, name, route))}
		</Container>
	);
}
