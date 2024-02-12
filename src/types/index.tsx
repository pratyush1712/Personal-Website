import { ReactNode } from "react";

export type LinkType = "professional" | "social";

export type Link = {
	index: number;
	type: LinkType;
	title: string;
	href: string;
	icon: React.ReactNode;
};

export type Page = {
	index: number;
	name: string;
	route: string;
	description: string;
	keywords: string[];
};

export type Song = {
	artist?: ReactNode;
	priority: number;
	url: string;
	tooltip: string;
	width?: number;
	height?: number;
};
