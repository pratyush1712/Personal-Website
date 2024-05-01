export type Content = {
	id: number;
	title: string;
	details: string;
	image: string;
	createdAt: string;
	updatedAt?: string;
	category: string;
	keywords: string[]; // to improve search
	tags: string[]; // to categorize content
	__typename?: string;
	htmlContent?: string;
	videoUrl?: string;
};
