type Page = {
	index: number;
	name: string;
	route: string;
	content: string;
};

const pages: Page[] = [
	{ index: 0, name: "overview.md", route: "overview", content: "" },
	{ index: 1, name: "education.md", route: "education", content: "" },
	{ index: 2, name: "experience.md", route: "experience", content: "" },
	{ index: 3, name: "affiliations.md", route: "affiliations", content: "" },
	{ index: 4, name: "projects.md", route: "projects", content: "" },
	{ index: 5, name: "skills.md", route: "skills", content: "" }
];

export default pages;
