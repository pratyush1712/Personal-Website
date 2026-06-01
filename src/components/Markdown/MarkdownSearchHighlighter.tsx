"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { buildHighlightPattern, hasHighlightQuery } from "@/utils/searchHighlight";

const HIGHLIGHT_ATTRIBUTE = "data-portfolio-search-highlight";

function cleanHighlights(root: HTMLElement) {
	const marks = Array.from(root.querySelectorAll(`mark[${HIGHLIGHT_ATTRIBUTE}]`));
	for (const mark of marks) {
		const text = document.createTextNode(mark.textContent ?? "");
		mark.replaceWith(text);
		text.parentElement?.normalize();
	}
}

function scrollToCurrentHash() {
	const rawHash = window.location.hash.slice(1);
	if (!rawHash) return;

	const targetId = decodeURIComponent(rawHash);
	window.setTimeout(() => {
		document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, 80);
}

function shouldSkipNode(node: Node): boolean {
	const parent = node.parentElement;
	return Boolean(parent?.closest(`script, style, pre, code, mark, [${HIGHLIGHT_ATTRIBUTE}]`));
}

function HighlightEffect({ contentId }: { contentId: string }) {
	const searchParams = useSearchParams();
	const query = (searchParams.get("q") ?? "").trim().slice(0, 120);

	useEffect(() => {
		scrollToCurrentHash();
		window.addEventListener("hashchange", scrollToCurrentHash);
		return () => window.removeEventListener("hashchange", scrollToCurrentHash);
	}, []);

	useEffect(() => {
		const root = document.getElementById(contentId);
		if (!root) return;

		cleanHighlights(root);
		if (!hasHighlightQuery(query)) return;

		const pattern = buildHighlightPattern(query);
		if (!pattern) return;

		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
			acceptNode: node => {
				if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
				pattern.lastIndex = 0;
				return pattern.test(node.textContent ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
			}
		});

		const nodes: Text[] = [];
		let current = walker.nextNode();
		while (current) {
			nodes.push(current as Text);
			current = walker.nextNode();
		}

		for (const textNode of nodes) {
			const text = textNode.textContent ?? "";
			pattern.lastIndex = 0;
			const parts = text.split(pattern);
			if (parts.length <= 1) continue;

			const fragment = document.createDocumentFragment();
			for (const part of parts) {
				if (!part) continue;
				pattern.lastIndex = 0;
				if (pattern.test(part)) {
					const mark = document.createElement("mark");
					mark.setAttribute(HIGHLIGHT_ATTRIBUTE, "true");
					mark.textContent = part;
					mark.style.padding = "0 2px";
					mark.style.borderRadius = "4px";
					mark.style.color = "inherit";
					mark.style.backgroundColor = "rgba(245, 158, 11, 0.28)";
					mark.style.boxShadow = "inset 0 -1px 0 rgba(245, 158, 11, 0.55)";
					fragment.appendChild(mark);
				} else {
					fragment.appendChild(document.createTextNode(part));
				}
			}

			textNode.replaceWith(fragment);
		}
	}, [contentId, query]);

	return null;
}

export default function MarkdownSearchHighlighter({ contentId }: { contentId: string }) {
	return (
		<Suspense fallback={null}>
			<HighlightEffect contentId={contentId} />
		</Suspense>
	);
}
