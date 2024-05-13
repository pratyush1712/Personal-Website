"use client";

import { useHotkeys } from "@mantine/hooks";
import { usePathname } from "next/navigation";

export const Hotkeys = () => {
	const pathname = usePathname();
	const useCustomPrint = pathname.includes("/blog/");
	const handleBlogPrint = () => {
		if (pathname.includes("/blog/")) {
			const blogId = pathname.split("/").pop();
			document.getElementById(`download-${blogId}`)?.click();
		}
	};
	useHotkeys([
		["mod+f", () => document.getElementById("search-bar")?.focus()],
		["mod+p", handleBlogPrint, { preventDefault: useCustomPrint }]
	]);
	return null;
};
