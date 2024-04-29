export type ContentCategory = "blog" | "video";

export type Content = {
	id: number;
	title: string;
	details: string;
	image: string;
	createdAt: string;
	category: ContentCategory;
	keywords: string[]; // to improve search
	tags: string[]; // to categorize content
};
