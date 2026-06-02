"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Box, type Theme } from "@mui/material";
import { type SystemStyleObject } from "@mui/system";
import { AgentTab } from "@/utils/agentStorage";
import { TOKENS } from "@/ui/Theme";

const STICKY_TOP_OFFSET_PX = 10;
const STICKY_TRANSITION_MS = 140;
const AUTO_SCROLL_THRESHOLD_PX = 96;

interface Props {
	tab: AgentTab | null;
	pending: boolean;
}

type ChatMessage = AgentTab["messages"][number];

type Segment =
	| { kind: "text"; value: string }
	| { kind: "inline-code"; value: string }
	| { kind: "code-block"; lang: string; value: string };

type ChatBlock = {
	userIndex: number | null;
	userContent: string | null;
	responses: Array<{
		index: number;
		content: string;
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

function buildBlocks(messages: ChatMessage[]): ChatBlock[] {
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

	return blocks;
}

function getMessageKey(message: ChatMessage, index: number) {
	const maybeId = (message as { id?: string | number }).id;
	return maybeId != null ? String(maybeId) : `${message.role}-${index}`;
}

function isNearBottom(el: HTMLDivElement, threshold = AUTO_SCROLL_THRESHOLD_PX) {
	return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
}

const AssistantContent = memo(function AssistantContent({ content }: { content: string }) {
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

				return (
					<Box key={`text-${i}`} component="span" sx={{ whiteSpace: "pre-wrap" }}>
						{seg.value}
					</Box>
				);
			})}
		</>
	);
});

const AssistantMessage = memo(function AssistantMessage({
	content,
	firstInBlock
}: {
	content: string;
	firstInBlock: boolean;
}) {
	return (
		<Box sx={[assistantMessageSx, firstInBlock ? assistantMessageFirstSx : assistantMessageFollowSx]}>
			<AssistantContent content={content} />
		</Box>
	);
});

const ThinkingDots = memo(function ThinkingDots() {
	return (
		<Box
			aria-live="polite"
			aria-label="Thinking"
			sx={{
				display: "flex",
				alignItems: "center",
				gap: "4px",
				py: "6px",
				"@keyframes agentPulse": {
					"0%, 80%, 100%": { opacity: 0.25, transform: "scale(0.85)" },
					"40%": { opacity: 1, transform: "scale(1)" }
				}
			}}>
			{[0, 1, 2].map(i => (
				<Box
					key={i}
					sx={{
						width: 5,
						height: 5,
						borderRadius: "50%",
						backgroundColor: theme => (theme.palette.mode === "dark" ? "#9a9a9a" : "#aaaaaa"),
						animation: "agentPulse 1.2s ease-in-out infinite",
						animationDelay: `${i * 0.2}s`
					}}
				/>
			))}
		</Box>
	);
});

export default function AgentChat({ tab, pending }: Props) {
	const messages = useMemo(() => tab?.messages ?? [], [tab?.messages]);
	const blocks = useMemo(() => buildBlocks(messages), [messages]);

	const scrollRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | null>(null);
	const userCardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
	const shouldStickToBottomRef = useRef(true);
	const previousLastSignatureRef = useRef<string>("");

	const [activeUserIndex, setActiveUserIndex] = useState<number | null>(null);
	const [showStickyHeader, setShowStickyHeader] = useState(false);

	const userIndices = useMemo(
		() => blocks.flatMap(block => (block.userIndex != null ? [block.userIndex] : [])),
		[blocks]
	);

	const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
	const lastIsUser = lastMessage?.role === "user";
	const lastMessageSignature = lastMessage
		? `${messages.length}:${lastMessage.role}:${lastMessage.content.length}`
		: "0";

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
			return;
		}

		const candidateEl = userCardRefs.current.get(candidate);
		const candidateRect = candidateEl?.getBoundingClientRect();
		const shouldShow = Boolean(candidateRect && candidateRect.top < anchorTop - 1);

		setActiveUserIndex(prev => (prev === candidate ? prev : candidate));
		setShowStickyHeader(prev => (prev === shouldShow ? prev : shouldShow));
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
	}, [measureStickyState, messages, pending]);

	useEffect(() => {
		const signatureChanged = previousLastSignatureRef.current !== lastMessageSignature;
		previousLastSignatureRef.current = lastMessageSignature;

		if (!signatureChanged) return;
		if (!shouldStickToBottomRef.current) return;

		bottomRef.current?.scrollIntoView({
			behavior: lastIsUser ? "smooth" : "auto",
			block: "end"
		});
	}, [lastIsUser, lastMessageSignature]);

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
					pointerEvents: "none"
				}}>
				<Box
					aria-hidden={!showStickyHeader}
					sx={{
						...stickyContextCardSx,
						opacity: showStickyHeader ? 1 : 0,
						transform: showStickyHeader ? "translateY(0)" : "translateY(-4px)",
						visibility: activeUserIndex != null ? "visible" : "hidden",
						transition: `opacity ${STICKY_TRANSITION_MS}ms ease, transform ${STICKY_TRANSITION_MS}ms ease`
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
										mb: block.responses.length > 0 ? "6px" : 0
									}}>
									<Box sx={userPromptCardSx}>{block.userContent}</Box>
								</Box>
							)}

							{block.responses.map((response, responseIndex) => (
								<AssistantMessage
									key={getMessageKey(messages[response.index], response.index)}
									content={response.content}
									firstInBlock={responseIndex === 0 && block.userIndex != null}
								/>
							))}

							{pending && blockIndex === blocks.length - 1 && lastIsUser && (
								<Box sx={thinkingRowAfterUserSx}>
									<ThinkingDots />
								</Box>
							)}
						</Box>
					);
				})}

				{pending && !lastIsUser && (
					<Box sx={thinkingRowSx}>
						<ThinkingDots />
					</Box>
				)}

				<div ref={bottomRef} />
			</Box>
		</Box>
	);
}

const sharedCardBaseSx: SystemStyleObject<Theme> = {
	width: "100%",
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
	whiteSpace: "pre-wrap",
	wordBreak: "break-word",
	px: "14px",
	py: "10px"
};

const stickyContextCardSx: SystemStyleObject<Theme> = {
	...sharedCardBaseSx,
	boxSizing: "border-box",
	px: "12px",
	py: "8px",
	fontSize: "0.78rem",
	lineHeight: 1.5,
	whiteSpace: "pre-wrap",
	wordBreak: "break-word",
	overflow: "hidden",
	display: "-webkit-box",
	WebkitLineClamp: 2,
	WebkitBoxOrient: "vertical",
	boxShadow: theme =>
		theme.palette.mode === "dark"
			? "0 1px 4px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)"
			: "0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)"
};

const assistantMessageSx: SystemStyleObject<Theme> = {
	width: "calc(100% - 2px)",
	marginLeft: "1px",
	marginRight: "1px",
	boxSizing: "border-box",
	fontSize: "0.8125rem",
	lineHeight: 1.6,
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

const thinkingRowSx: SystemStyleObject<Theme> = {
	width: "calc(100% - 2px)",
	marginLeft: "1px",
	marginRight: "1px",
	boxSizing: "border-box",
	pt: "4px"
};

const thinkingRowAfterUserSx: SystemStyleObject<Theme> = {
	width: "calc(100% - 2px)",
	marginLeft: "1px",
	marginRight: "1px",
	boxSizing: "border-box",
	pt: "2px"
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
	scrollbarWidth: "thin",
	scrollbarColor: theme =>
		`${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"} transparent`,
	"&::-webkit-scrollbar": { width: 4 },
	"&::-webkit-scrollbar-thumb": {
		borderRadius: 2,
		backgroundColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)")
	}
};
