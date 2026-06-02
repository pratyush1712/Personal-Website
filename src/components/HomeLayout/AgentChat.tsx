"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, type Theme } from "@mui/material";
import { type SystemStyleObject } from "@mui/system";
import { AgentTab } from "@/utils/agents/agentStorage";
import { TOKENS } from "@/ui/Theme";

const STICKY_TOP_OFFSET_PX = 10;
const STICKY_TRANSITION_MS = 160;
const AUTO_SCROLL_THRESHOLD_PX = 96;

interface Props {
	tab: AgentTab | null;
	pending: boolean;
	streamingReply?: string;
	statusText?: string;
}

type ChatMessage = AgentTab["messages"][number];

type Segment =
	| { kind: "text"; value: string }
	| { kind: "inline-code"; value: string }
	| { kind: "code-block"; lang: string; value: string };

type TextPart = { bold: boolean; value: string };

type ChatBlock = {
	userIndex: number | null;
	userContent: string | null;
	responses: Array<{
		index: number;
		content: string;
		streaming?: boolean;
	}>;
};

function splitInline(text: string): Segment[] {
	const out: Segment[] = [];
	const inlineRe = /`([^`\n]+)`/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = inlineRe.exec(text)) !== null) {
		if (match.index > lastIndex) {
			out.push({ kind: "text", value: text.slice(lastIndex, match.index) });
		}
		out.push({ kind: "inline-code", value: match[1] });
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		out.push({ kind: "text", value: text.slice(lastIndex) });
	}

	return out;
}

function splitBold(text: string): TextPart[] {
	const out: TextPart[] = [];
	const boldRe = /\*\*([\s\S]+?)\*\*/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = boldRe.exec(text)) !== null) {
		if (match.index > lastIndex) {
			out.push({ bold: false, value: text.slice(lastIndex, match.index) });
		}
		out.push({ bold: true, value: match[1] });
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		out.push({ bold: false, value: text.slice(lastIndex) });
	}

	return out.length > 0 ? out : [{ bold: false, value: text }];
}

function parseAssistantContent(input: string): Segment[] {
	const segments: Segment[] = [];
	const fenceRe = /```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = fenceRe.exec(input)) !== null) {
		if (match.index > lastIndex) {
			segments.push(...splitInline(input.slice(lastIndex, match.index)));
		}

		segments.push({
			kind: "code-block",
			lang: match[1] || "",
			value: match[2].replace(/\n$/, "")
		});

		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < input.length) {
		segments.push(...splitInline(input.slice(lastIndex)));
	}

	return segments;
}

function buildBlocks(messages: ChatMessage[], streamingReply = ""): ChatBlock[] {
	const blocks: ChatBlock[] = [];
	let current: ChatBlock | null = null;

	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];

		if (message.role === "user") {
			current = {
				userIndex: i,
				userContent: message.content,
				responses: []
			};
			blocks.push(current);
			continue;
		}

		if (!current) {
			current = {
				userIndex: null,
				userContent: null,
				responses: []
			};
			blocks.push(current);
		}

		current.responses.push({
			index: i,
			content: message.content
		});
	}

	if (streamingReply) {
		if (!current) {
			current = {
				userIndex: null,
				userContent: null,
				responses: []
			};
			blocks.push(current);
		}

		current.responses.push({
			index: messages.length,
			content: streamingReply,
			streaming: true
		});
	}

	return blocks;
}

function getMessageKey(message: ChatMessage | undefined, index: number, streaming?: boolean) {
	if (streaming) return `streaming-${index}`;
	const maybeId = message ? (message as { id?: string | number }).id : null;
	return maybeId != null ? String(maybeId) : `${message?.role ?? "assistant"}-${index}`;
}

function isNearBottom(el: HTMLDivElement, threshold = AUTO_SCROLL_THRESHOLD_PX) {
	return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
}

const AssistantContent = memo(function AssistantContent({
	content,
	streaming
}: {
	content: string;
	streaming?: boolean;
}) {
	const segments = useMemo(() => parseAssistantContent(content), [content]);

	return (
		<>
			{segments.map((seg, i) => {
				if (seg.kind === "code-block") {
					return (
						<Box key={`code-${i}`} component="pre" sx={codeBlockSx}>
							{seg.value}
						</Box>
					);
				}

				if (seg.kind === "inline-code") {
					return (
						<Box key={`inline-${i}`} component="code" sx={inlineCodeSx}>
							{seg.value}
						</Box>
					);
				}

				const parts = splitBold(seg.value);

				return (
					<Box key={`text-${i}`} component="span" sx={{ whiteSpace: "pre-wrap" }}>
						{parts.map((part, j) =>
							part.bold ? (
								<Box key={`bold-${j}`} component="strong" sx={boldTextSx}>
									{part.value}
								</Box>
							) : (
								<Box key={`plain-${j}`} component="span">
									{part.value}
								</Box>
							)
						)}
					</Box>
				);
			})}
			{streaming && <Box component="span" aria-hidden sx={streamingCursorSx} />}
		</>
	);
});

const AssistantMessage = memo(function AssistantMessage({
	content,
	firstInBlock,
	streaming
}: {
	content: string;
	firstInBlock: boolean;
	streaming?: boolean;
}) {
	return (
		<Box sx={[assistantMessageSx, firstInBlock ? assistantMessageFirstSx : assistantMessageFollowSx]}>
			<AssistantContent content={content} streaming={streaming} />
		</Box>
	);
});

const StatusLine = memo(function StatusLine({ label }: { label: string }) {
	return (
		<Box sx={statusLineSx} aria-live="polite">
			<Box sx={statusPulseSx} />
			<Typography component="span" sx={statusTextSx}>
				{label}
			</Typography>
		</Box>
	);
});

export default function AgentChat({ tab, pending, streamingReply = "", statusText }: Props) {
	const messages = useMemo(() => tab?.messages ?? [], [tab?.messages]);
	const hasStreamingReply = streamingReply.length > 0;
	const blocks = useMemo(() => buildBlocks(messages, streamingReply), [messages, streamingReply]);

	const scrollRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | null>(null);
	const scrollRafRef = useRef<number | null>(null);
	const userCardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
	const shouldStickToBottomRef = useRef(true);
	const previousLastSignatureRef = useRef<string>("");

	const [activeUserIndex, setActiveUserIndex] = useState<number | null>(null);
	const [showStickyHeader, setShowStickyHeader] = useState(false);
	const [stickyHeight, setStickyHeight] = useState(0);

	const userIndices = useMemo(
		() => blocks.flatMap(block => (block.userIndex != null ? [block.userIndex] : [])),
		[blocks]
	);

	const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
	const lastIsUser = lastMessage?.role === "user";
	const lastMessageSignature = lastMessage
		? `${messages.length}:${lastMessage.role}:${lastMessage.content.length}:${streamingReply.length}`
		: `0:${streamingReply.length}`;

	const activeStickyContent =
		activeUserIndex != null && messages[activeUserIndex]?.role === "user" ? messages[activeUserIndex].content : "";

	const setUserCardRef = useCallback(
		(index: number) => (el: HTMLDivElement | null) => {
			if (el) userCardRefs.current.set(index, el);
			else userCardRefs.current.delete(index);
		},
		[]
	);

	const measureStickyState = useCallback(() => {
		const scrollEl = scrollRef.current;
		if (!scrollEl) return;

		const containerTop = scrollEl.getBoundingClientRect().top;
		const anchorTop = containerTop + STICKY_TOP_OFFSET_PX;
		let candidate: number | null = null;

		for (const index of userIndices) {
			const el = userCardRefs.current.get(index);
			if (!el) continue;

			const rect = el.getBoundingClientRect();
			if (rect.top <= anchorTop + 1) {
				candidate = index;
			} else {
				break;
			}
		}

		if (candidate == null) {
			setActiveUserIndex(prev => (prev === null ? prev : null));
			setShowStickyHeader(prev => (prev ? false : prev));
			setStickyHeight(prev => (prev === 0 ? prev : 0));
			return;
		}

		const candidateEl = userCardRefs.current.get(candidate);
		const candidateRect = candidateEl?.getBoundingClientRect();
		const shouldShow = Boolean(candidateRect && candidateRect.top < anchorTop - 1);
		const nextStickyHeight = candidateRect ? Math.ceil(candidateRect.height) : 0;

		setActiveUserIndex(prev => (prev === candidate ? prev : candidate));
		setShowStickyHeader(prev => (prev === shouldShow ? prev : shouldShow));
		setStickyHeight(prev => (Math.abs(prev - nextStickyHeight) <= 1 ? prev : nextStickyHeight));
	}, [userIndices]);

	const scheduleMeasure = useCallback(() => {
		if (rafRef.current != null) return;

		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			measureStickyState();
		});
	}, [measureStickyState]);

	const handleScroll = useCallback(() => {
		const scrollEl = scrollRef.current;
		if (!scrollEl) return;

		shouldStickToBottomRef.current = isNearBottom(scrollEl);
		scheduleMeasure();
	}, [scheduleMeasure]);

	const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
		const scrollEl = scrollRef.current;
		if (!scrollEl) return;

		if (scrollRafRef.current != null) {
			cancelAnimationFrame(scrollRafRef.current);
		}

		scrollRafRef.current = requestAnimationFrame(() => {
			scrollRafRef.current = null;
			scrollEl.scrollTo({
				top: scrollEl.scrollHeight,
				behavior
			});
		});
	}, []);

	useEffect(() => {
		const scrollEl = scrollRef.current;
		if (!scrollEl) return;

		shouldStickToBottomRef.current = isNearBottom(scrollEl);

		scrollEl.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", scheduleMeasure);

		return () => {
			scrollEl.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", scheduleMeasure);

			if (rafRef.current != null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}

			if (scrollRafRef.current != null) {
				cancelAnimationFrame(scrollRafRef.current);
				scrollRafRef.current = null;
			}
		};
	}, [handleScroll, scheduleMeasure]);

	useEffect(() => {
		const scrollEl = scrollRef.current;
		if (!scrollEl || typeof ResizeObserver === "undefined") return;

		const observer = new ResizeObserver(() => {
			shouldStickToBottomRef.current = isNearBottom(scrollEl);
			scheduleMeasure();
		});

		observer.observe(scrollEl);
		return () => observer.disconnect();
	}, [scheduleMeasure]);

	useLayoutEffect(() => {
		measureStickyState();
	}, [measureStickyState, messages, pending, streamingReply]);

	useEffect(() => {
		const signatureChanged = previousLastSignatureRef.current !== lastMessageSignature;
		previousLastSignatureRef.current = lastMessageSignature;

		if (!signatureChanged) return;
		if (!shouldStickToBottomRef.current) return;

		scrollToBottom(hasStreamingReply ? "auto" : "smooth");
	}, [hasStreamingReply, lastMessageSignature, scrollToBottom]);

	return (
		<Box
			ref={scrollRef}
			role="log"
			aria-live="polite"
			aria-relevant="additions text"
			sx={{
				flex: 1,
				minHeight: 0,
				position: "relative",
				overscrollBehaviorY: "contain",
				...scrollAreaSx
			}}>
			<Box
				sx={{
					position: "sticky",
					top: `${STICKY_TOP_OFFSET_PX}px`,
					zIndex: 5,
					px: "14px",
					pointerEvents: "none",
					overflow: "visible"
				}}>
				<Box
					aria-hidden={!showStickyHeader}
					sx={{
						...stickyPromptOverlaySx,
						height: stickyHeight > 0 ? `${stickyHeight}px` : "auto",
						opacity: showStickyHeader ? 1 : 0,
						transform: showStickyHeader ? "translateY(0)" : "translateY(-1px)",
						visibility: activeUserIndex != null ? "visible" : "hidden",
						transition: `opacity ${STICKY_TRANSITION_MS}ms ease, transform ${STICKY_TRANSITION_MS}ms ease, box-shadow ${STICKY_TRANSITION_MS}ms ease`
					}}>
					{activeStickyContent}
				</Box>
			</Box>

			<Box
				sx={{
					px: "14px",
					display: "flex",
					flexDirection: "column"
				}}>
				{blocks.map((block, blockIndex) => {
					const blockKey =
						block.userIndex != null ? `block-user-${block.userIndex}` : `block-assistant-${blockIndex}`;
					const isLastBlock = blockIndex === blocks.length - 1;

					return (
						<Box
							key={blockKey}
							sx={{
								width: "100%",
								mb: blockIndex < blocks.length - 1 ? "16px" : 0
							}}>
							{block.userIndex != null && block.userContent != null && (
								<Box
									ref={setUserCardRef(block.userIndex)}
									sx={{
										width: "100%",
										mb: block.responses.length > 0 || pending ? "6px" : 0
									}}>
									<Box sx={userPromptCardSx}>{block.userContent}</Box>
								</Box>
							)}

							{block.responses.map((response, responseIndex) => (
								<AssistantMessage
									key={getMessageKey(messages[response.index], response.index, response.streaming)}
									content={response.content}
									firstInBlock={responseIndex === 0 && block.userIndex != null}
									streaming={response.streaming}
								/>
							))}

							{pending && isLastBlock && !hasStreamingReply && (
								<Box sx={thinkingRowAfterUserSx}>
									<StatusLine label={statusText ?? "Reading portfolio context…"} />
								</Box>
							)}
						</Box>
					);
				})}

				{pending && hasStreamingReply && (
					<Box sx={streamingStatusRowSx}>
						<StatusLine label={statusText ?? "Writing response…"} />
					</Box>
				)}

				<div ref={bottomRef} />
			</Box>
		</Box>
	);
}

const sharedCardBaseSx: SystemStyleObject<Theme> = {
	width: "100%",
	boxSizing: "border-box",
	borderRadius: "12px",
	border: "1px solid",
	borderColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.border : "rgba(0,0,0,0.12)"),
	backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.elevated : TOKENS.light.surface),
	color: theme => (theme.palette.mode === "dark" ? "#e6e6e6" : "#353535")
};

const userPromptCardSx: SystemStyleObject<Theme> = {
	...sharedCardBaseSx,
	boxShadow: theme =>
		theme.palette.mode === "dark"
			? "0 2px 8px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.04)"
			: "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
	fontSize: "0.8125rem",
	lineHeight: 1.6,
	transition: "box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease",
	whiteSpace: "pre-wrap",
	wordBreak: "break-word",
	px: "14px",
	py: "10px"
};

const stickyPromptOverlaySx: SystemStyleObject<Theme> = {
	...userPromptCardSx,
	overflow: "hidden",
	willChange: "opacity, transform",
	boxShadow: theme =>
		theme.palette.mode === "dark"
			? "0 8px 22px rgba(0,0,0,0.34), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)"
			: "0 8px 22px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.75)"
};

const assistantMessageSx: SystemStyleObject<Theme> = {
	width: "calc(100% - 2px)",
	marginLeft: "1px",
	marginRight: "1px",
	boxSizing: "border-box",
	fontSize: "0.8125rem",
	lineHeight: 1.65,
	color: theme => (theme.palette.mode === "dark" ? "#e4e4e4" : "#3b3b3b"),
	wordBreak: "break-word"
};

const assistantMessageFirstSx: SystemStyleObject<Theme> = {
	pt: "2px",
	pb: "4px"
};

const assistantMessageFollowSx: SystemStyleObject<Theme> = {
	py: "4px"
};

const thinkingRowAfterUserSx: SystemStyleObject<Theme> = {
	width: "calc(100% - 2px)",
	marginLeft: "1px",
	marginRight: "1px",
	boxSizing: "border-box",
	pt: "2px"
};

const streamingStatusRowSx: SystemStyleObject<Theme> = {
	width: "calc(100% - 2px)",
	marginLeft: "1px",
	marginRight: "1px",
	boxSizing: "border-box",
	pt: "6px",
	pb: "2px"
};

const statusLineSx: SystemStyleObject<Theme> = {
	display: "inline-flex",
	alignItems: "center",
	gap: "7px",
	minHeight: "22px",
	color: "text.secondary"
};

const statusTextSx: SystemStyleObject<Theme> = {
	fontSize: "0.75rem",
	lineHeight: 1.4,
	color: "text.secondary"
};

const statusPulseSx: SystemStyleObject<Theme> = {
	width: 6,
	height: 6,
	borderRadius: "50%",
	backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.accent : TOKENS.light.accent),
	"@keyframes agentStatusPulse": {
		"0%, 100%": { opacity: 0.35, transform: "scale(0.9)" },
		"50%": { opacity: 1, transform: "scale(1.12)" }
	},
	animation: "agentStatusPulse 1.25s ease-in-out infinite"
};

const streamingCursorSx: SystemStyleObject<Theme> = {
	display: "inline-block",
	width: "7px",
	height: "1.05em",
	ml: "2px",
	mb: "-2px",
	borderRadius: "1px",
	backgroundColor: "currentColor",
	"@keyframes agentCursorBlink": {
		"0%, 45%": { opacity: 0.75 },
		"46%, 100%": { opacity: 0.12 }
	},
	animation: "agentCursorBlink 1s step-end infinite"
};

const codeBlockSx: SystemStyleObject<Theme> = {
	my: "8px",
	p: "10px 12px",
	borderRadius: "8px",
	border: "1px solid",
	borderColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"),
	backgroundColor: theme => (theme.palette.mode === "dark" ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.04)"),
	fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
	fontSize: "0.75rem",
	lineHeight: 1.55,
	color: theme => (theme.palette.mode === "dark" ? "#e6e6e6" : "#222"),
	overflowX: "auto",
	whiteSpace: "pre",
	m: 0
};

const boldTextSx: SystemStyleObject<Theme> = {
	fontWeight: 600,
	color: "inherit"
};

const inlineCodeSx: SystemStyleObject<Theme> = {
	px: "5px",
	py: "1px",
	mx: "1px",
	borderRadius: "4px",
	border: "1px solid",
	borderColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"),
	backgroundColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
	fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
	fontSize: "0.75rem",
	color: theme => (theme.palette.mode === "dark" ? "#e6e6e6" : "#222")
};

const scrollAreaSx: SystemStyleObject<Theme> = {
	overflowY: "auto",
	overflowX: "hidden",
	scrollBehavior: "smooth",
	scrollbarWidth: "thin",
	scrollbarColor: theme =>
		`${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"} transparent`,
	"&::-webkit-scrollbar": { width: 4 },
	"&::-webkit-scrollbar-thumb": {
		borderRadius: 2,
		backgroundColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)")
	}
};
