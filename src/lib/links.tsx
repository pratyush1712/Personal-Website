import React from "react";
import { FaEnvelope, FaFacebook, FaFilePdf, FaGithub, FaInstagram, FaLinkedin, FaSpotify } from "react-icons/fa";

type LinkType = "professional" | "social";
type Link = {
	index: number;
	type: LinkType;
	title: string;
	href: string;
	icon: React.ReactNode;
};

export const links: Link[] = [
	{
		index: 0,
		type: "professional",
		title: "Find me on Github",
		href: "https://github.com/pratyush1712",
		icon: <FaGithub />
	},
	{
		index: 1,
		type: "professional",
		title: "Find me on LinkedIn",
		href: "https://www.linkedin.com/in/pratyushsudhakar/",
		icon: <FaLinkedin />
	},
	{
		index: 2,
		type: "professional",
		title: "Contact me via email",
		href: "mailto:ps2245@cornell.edu",
		icon: <FaEnvelope />
	},
	{
		index: 3,
		type: "professional",
		title: "Checkout my Resume",
		href: "/resume.pdf",
		icon: <FaFilePdf />
	},
	{
		index: 4,
		type: "social",
		title: "Find me on Instagram",
		href: "https://www.instagram.com/pratyush.sudhakar/",
		icon: <FaInstagram />
	},
	{
		index: 5,
		type: "social",
		title: "Find me on Facebook",
		href: "https://www.facebook.com/pratyush.sudhakar/",
		icon: <FaFacebook />
	},
	{
		index: 6,
		type: "social",
		title: "Find me on Spotify",
		href: "https://open.spotify.com/user/316666pv6iuuy2nzkpvw6pqbeuxu?si=Bkt1cg33QPql5toe7vfo3A&utm_source=native-share-menu&nd=1/",
		icon: <FaSpotify />
	}
];
