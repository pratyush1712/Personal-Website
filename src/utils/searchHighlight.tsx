import { Box } from "@mui/material";
import type { ReactNode } from "react";

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getSearchTerms(query: string): string[] {
	const normalizedQuery = query.trim().replace(/\s+/g, " ");
	if (!normalizedQuery) return [];

	const terms = [normalizedQuery, ...normalizedQuery.split(" ")]
		.map(term => term.trim())
		.filter(term => term.length > 1);

	return Array.from(new Set(terms.map(term => term.toLowerCase())))
		.sort((a, b) => b.length - a.length)
		.map(term => terms.find(original => original.toLowerCase() === term) ?? term);
}

export function hasHighlightQuery(query: string): boolean {
	return getSearchTerms(query).length > 0;
}

export function buildHighlightPattern(query: string): RegExp | null {
	const terms = getSearchTerms(query);
	if (terms.length === 0) return null;
	return new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
}

export function highlightText(value: string, query: string): ReactNode {
	const terms = getSearchTerms(query);
	if (terms.length === 0) return value;

	const pattern = buildHighlightPattern(query);
	if (!pattern) return value;
	const parts = value.split(pattern);

	return parts.map((part, index) => {
		if (!part) return null;
		const isMatch = terms.some(term => term.toLowerCase() === part.toLowerCase());
		if (!isMatch) return part;

		return (
			<Box
				key={`${part}-${index}`}
				component="mark"
				sx={{
					px: 0.25,
					borderRadius: 0.5,
					color: "inherit",
					backgroundColor: "rgba(245, 158, 11, 0.28)",
					boxShadow: "inset 0 -1px 0 rgba(245, 158, 11, 0.55)"
				}}>
				{part}
			</Box>
		);
	});
}
