import { Children, isValidElement, type ReactNode } from "react";

function textFromNode(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textFromNode).join(" ");
	if (isValidElement<{ children?: ReactNode }>(node)) return textFromNode(node.props.children);
	return "";
}

export function slugifyHeading(value: string): string {
	return value
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export function headingIdFromChildren(children: ReactNode): string | undefined {
	const text = Children.toArray(children).map(textFromNode).join(" ");
	const slug = slugifyHeading(text);
	return slug || undefined;
}
