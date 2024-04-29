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
	id: string;
	name: string;
	artist?: ReactNode;
	url: string;
	image: string;
	position: number | null;
	width?: number;
	height?: number;
};

export type User = {
	name?: string | null | undefined;
	email?: string | null | undefined;
	image?: string | null | undefined;
};

export * from "./close-friends";
