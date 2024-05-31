import { Page } from "@/types";

const pages: Page[] = [
	{
		index: 0,
		name: "overview.md",
		route: "overview",
		description: "Profile overview for Pratyush",
		keywords: ["Pratyush Sudhakar", "Pratyush", "Pratyush Sudhakar Cornell", "Pratyush Cornell"]
	},
	{
		index: 1,
		name: "education.md",
		route: "education",
		description: "Academic qualifications of Pratyush",
		keywords: [
			"Pratyush Sudhakar Cornell",
			"Pratyush Sudhakar Mathematics",
			"Pratyush Sudhakar Computer Science",
			"Pratyush Education"
		]
	},
	{
		index: 2,
		name: "experience.md",
		route: "experience",
		description: "Work history and roles held by Pratyush",
		keywords: [
			"Pratyush Sudhakar Cornell",
			"Pratyush Sudhakar Experience",
			"Pratyush Sudhakar Work Experience",
			"Pratyush Software Engineer",
			"Pratyush Software Developer"
		]
	},
	{
		index: 3,
		name: "affiliations.md",
		route: "affiliations",
		description: "Career and other affiliations of Pratyush at Cornell",
		keywords: [
			"Pratyush Sudhakar Cornell",
			"Pratyush Sudhakar Affiliations",
			"Pratyush Sudhakar Cornell Affiliations",
			"Pratyush Sudhakar Cornell Career",
			"Digital Tech Cornell",
			"Wushu Cornell",
			"Cornell Wushu",
			"Cornell Wushu Club",
			"Perfect Match",
			"Cornell Perfect Match",
			"Cornell Perfect Match Team",
			"Cornell Perfect Match Engineering"
		]
	},
	{
		index: 4,
		name: "projects.md",
		route: "projects",
		description: "Projects undertaken by Pratyush",
		keywords: [
			"Pratyush Sudhakar Projects",
			"Pratyush Sudhakar Cornell Projects",
			"Pratyush Sudhakar Software Projects",
			"Pratyush Sudhakar Software Engineering Projects"
		]
	},
	{
		index: 5,
		name: "skills.md",
		route: "skills",
		description: "Technical skills possessed by Pratyush",
		keywords: [
			"Pratyush Sudhakar Skills",
			"Pratyush Backend",
			"Pratyush Frontend",
			"Pratyush Sudhakar Software Engineering Skills"
		]
	}
	// {
	// 	index: 6,
	// 	name: "contact.md",
	// 	route: "contact",
	// 	description: "Contact information for Pratyush",
	// 	keywords: [
	// 		"Pratyush Sudhakar Contact",
	// 		"Pratyush Sudhakar Contact Information",
	// 		"Pratyush Sudhakar Cornell Contact",
	// 		"Pratyush Sudhakar Contact Info",
	// 		"Pratyush Sudhakar Contact Info Cornell"
	// 	]
	// }
];

const routeToPage: { [key: string]: Page } = {};
pages.forEach(page => {
	routeToPage[page.route] = page;
});
export { routeToPage };

export default pages;
