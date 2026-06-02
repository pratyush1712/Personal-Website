"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
	/** localStorage key used to persist the chosen width across sessions. */
	storageKey: string;
	/** Width (px) used before any persisted value is read / when none exists. */
	defaultWidth: number;
	/** Lower bound (px) so the panel can never be dragged into nothing. */
	minWidth?: number;
	/** Upper bound (px) so the panel can never dominate the screen. */
	maxWidth?: number;
	/**
	 * Which edge the drag handle sits on. "right" suits a left sidebar (dragging
	 * right grows it); "left" suits a right sidebar (dragging right shrinks it).
	 */
	side: "left" | "right";
}

interface ResizableWidth {
	/** Current width in px, clamped to [minWidth, maxWidth]. */
	width: number;
	/** True while an active drag is in progress (used to highlight the handle). */
	isDragging: boolean;
	/** Pointer-down handler to attach to the drag handle. */
	startDragging: (e: React.PointerEvent) => void;
	/** Keyboard handler so the handle is operable with arrow keys. */
	onKeyDown: (e: React.KeyboardEvent) => void;
}

const KEYBOARD_STEP = 16;

/**
 * Drag-to-resize width state for a side panel, persisted to localStorage so the
 * chosen width survives reloads. Hydration happens after mount to avoid an SSR
 * mismatch (the server has no access to localStorage).
 */
export function useResizableWidth({
	storageKey,
	defaultWidth,
	minWidth = 160,
	maxWidth = 480,
	side
}: Options): ResizableWidth {
	const [width, setWidth] = useState(defaultWidth);
	const [isDragging, setIsDragging] = useState(false);

	const clamp = useCallback((w: number) => Math.min(maxWidth, Math.max(minWidth, w)), [minWidth, maxWidth]);

	// Refs hold the live drag origin so the window listeners stay referentially stable.
	const draggingRef = useRef(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(defaultWidth);

	const persist = useCallback(
		(w: number) => {
			try {
				localStorage.setItem(storageKey, String(w));
			} catch {
				/* storage unavailable (private mode / quota) - width simply won't persist */
			}
		},
		[storageKey]
	);

	// Hydrate the persisted width once, after mount.
	useEffect(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			if (stored !== null) {
				const parsed = Number.parseInt(stored, 10);
				if (Number.isFinite(parsed)) setWidth(clamp(parsed));
			}
		} catch {
			/* ignore */
		}
	}, [storageKey, clamp]);

	const stopDragging = useCallback(() => {
		if (!draggingRef.current) return;
		draggingRef.current = false;
		setIsDragging(false);
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
		setWidth(w => {
			persist(w);
			return w;
		});
	}, [persist]);

	const onPointerMove = useCallback(
		(e: PointerEvent) => {
			if (!draggingRef.current) return;
			const delta = e.clientX - startXRef.current;
			// A right-edge handle grows with rightward motion; a left-edge handle shrinks.
			const signed = side === "right" ? delta : -delta;
			setWidth(clamp(startWidthRef.current + signed));
		},
		[clamp, side]
	);

	// Window-level listeners are bound for the lifetime of an active drag only.
	useEffect(() => {
		if (!isDragging) return;
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", stopDragging);
		window.addEventListener("pointercancel", stopDragging);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", stopDragging);
			window.removeEventListener("pointercancel", stopDragging);
		};
	}, [isDragging, onPointerMove, stopDragging]);

	const startDragging = useCallback(
		(e: React.PointerEvent) => {
			e.preventDefault();
			draggingRef.current = true;
			startXRef.current = e.clientX;
			startWidthRef.current = width;
			setIsDragging(true);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";
		},
		[width]
	);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			// Left/Right arrows nudge the width; the sign matches the handle's edge.
			const grow = side === "right" ? "ArrowRight" : "ArrowLeft";
			const shrink = side === "right" ? "ArrowLeft" : "ArrowRight";
			if (e.key !== grow && e.key !== shrink) return;
			e.preventDefault();
			setWidth(w => {
				const next = clamp(w + (e.key === grow ? KEYBOARD_STEP : -KEYBOARD_STEP));
				persist(next);
				return next;
			});
		},
		[side, clamp, persist]
	);

	return { width, isDragging, startDragging, onKeyDown };
}
