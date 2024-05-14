import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://pratyushsudhakar.com/",
			changeFrequency: "monthly",
			priority: 1.0
		},
		{
			url: "https://pratyushsudhakar.com/overview",
			changeFrequency: "monthly",
			priority: 1.0
		},
		{
			url: "https://pratyushsudhakar.com/skills",
			changeFrequency: "monthly",
			priority: 0.3
		},
		{
			url: "https://pratyushsudhakar.com/projects",
			changeFrequency: "monthly",
			priority: 0.3
		},
		{
			url: "https://pratyushsudhakar.com/education",
			changeFrequency: "monthly",
			priority: 0.5
		},
		{
			url: "https://pratyushsudhakar.com/affiliations",
			changeFrequency: "monthly",
			priority: 0.5
		},
		{
			url: "https://pratyushsudhakar.com/experience",
			changeFrequency: "monthly",
			priority: 0.5
		},
		{
			url: "https://pratyushsudhakar.com/resume.pdf",
			changeFrequency: "weekly",
			priority: 1.0
		}
	];
}
