"use client";

import { Box } from "@mui/material";

interface Props {
	/** Edge of the parent the handle is pinned to (the panel's inner edge). */
	side: "left" | "right";
	/** Highlight the handle while a drag is in progress. */
	active: boolean;
	onPointerDown: (e: React.PointerEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	/** Accessible label, e.g. "Resize explorer". */
	label: string;
	/** Current width (px) reported to assistive tech via aria-valuenow. */
	width: number;
	min: number;
	max: number;
}

/**
 * A thin, draggable separator pinned to one inner edge of a side panel. The
 * parent must be `position: relative`. A 2px guide line shows on hover / drag;
 * the hit area is wider (7px) so it's easy to grab.
 */
export default function ResizeHandle({ side, active, onPointerDown, onKeyDown, label, width, min, max }: Props) {
	return (
		<Box
			role="separator"
			aria-orientation="vertical"
			aria-label={label}
			aria-valuenow={Math.round(width)}
			aria-valuemin={min}
			aria-valuemax={max}
			tabIndex={0}
			onPointerDown={onPointerDown}
			onKeyDown={onKeyDown}
			sx={{
				position: "absolute",
				top: 0,
				bottom: 0,
				[side]: 0,
				width: "7px",
				zIndex: 5,
				cursor: "col-resize",
				touchAction: "none",
				"&::after": {
					content: '""',
					position: "absolute",
					top: 0,
					bottom: 0,
					[side]: 0,
					width: "2px",
					backgroundColor: active ? "primary.main" : "transparent",
					transition: "background-color 120ms ease"
				},
				"&:hover::after": { backgroundColor: "primary.main" },
				"&:focus-visible": { outline: "none" },
				"&:focus-visible::after": { backgroundColor: "primary.main" }
			}}
		/>
	);
}
