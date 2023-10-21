type Page = {
	index: number;
	name: string;
	route: string;
	description: string;
};

const pages: Page[] = [
	{ index: 0, name: "overview.md", route: "overview", description: "Profile overview for Pratyush" },
	{ index: 1, name: "education.md", route: "education", description: "Academic qualifications of Pratyush" },
	{ index: 2, name: "experience.md", route: "experience", description: "Work history and roles held by Pratyush" },
	{ index: 3, name: "affiliations.md", route: "affiliations", description: "Career and other affiliations of Pratyush at Cornell" },
	{ index: 4, name: "projects.md", route: "projects", description: "Projects undertaken by Pratyush" },
	{ index: 5, name: "skills.md", route: "skills", description: "Technical skills possessed by Pratyush" }
];

const routeToPage: { [key: string]: Page } = {};
pages.forEach(page => {
	routeToPage[page.route] = page;
});
export { routeToPage };

export default pages;
