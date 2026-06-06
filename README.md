# My Cursor-Themed Personal Website

A Cursor-inspired, AI-native personal workspace built with Next.js 16 (App Router) and Material UI: [Live Demo](https://pratyushsudhakar.com/)

<p align="left">
		<em>Developed with the software and tools below.</em>
</p>
<p align="left">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/GraphQL-E10098.svg?style=flat&logo=GraphQL&logoColor=white" alt="GraphQL">
	<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" alt="YAML">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<br>
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=MongoDB&logoColor=white" alt="MongoDB">
	<img src="https://img.shields.io/badge/Python-3776AB.svg?style=flat&logo=Python&logoColor=white" alt="Python">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>
<hr>

## 🔗 Quick Links

> -   [📍 Overview](#-overview)
> -   [📸 Screenshots](#-screenshots)
> -   [🎉 Features](#-features)
> -   [🚀 Getting Started](#-getting-started)
>     -   [⚙️ Installation](#️-installation)
>     -   [🤖 Running](#-running)
> -   [🤝 Contributing](#-contributing)

---

## 📍 Overview

The source code for my personal website: a Cursor-style IDE workspace where my portfolio content lives as files in an explorer, opens as tabs, and is queryable through an in-app AI agent.

---

## 📸 Screenshots

### Home

Apple Watch-themed landing page inside the Cursor-style workspace.

![Home page](public/screenshots/homepage.png)

### Overview

Portfolio content opened as markdown tabs in the editor surface.

![Overview tab](public/screenshots/overview.png)

### Portfolio Agent

In-app AI agent answering recruiter-style questions with streamed markdown responses.

![Agents panel](public/screenshots/agents-panel.png)

---

## 🎉 Features

-   **Cursor-style workspace**: Left sidebar, explorer panel, agents panel, and editor surface laid out like the Cursor IDE.
-   **Portfolio AI Agent**: An in-app chat agent that answers questions about my experience, projects, education, and the site itself.
    -   Server-streamed responses via the Vercel AI SDK
    -   Hourly rate limits and prompt guards to keep responses on-topic
    -   Context-aware: experience, projects, GitHub activity, and site-support questions
    -   Markdown rendering (bold, lists, links) in responses
-   **Content files**: Markdown-backed pages — Overview, Experience, Education, Projects, Skills — opened as tabs in the workspace.
-   **Home page**: Apple Watch-themed landing page with bubbles surfacing my Spotify playlist.
-   **Resume**: Downloadable PDF.
-   **Light and dark mode**: Themed across every panel.

---

## 🚀 Getting Started

**_Requirements_**

Ensure you have the following dependencies installed on your system:

-   **TypeScript**
-   **pnpm**

### ⚙️ Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/pratyush1712/Personal-Website/
    ```

2. Change to the project directory:

    ```sh
    cd Personal-Website
    ```

3. Install the dependencies:

    ```sh
    pnpm install
    ```

### 🤖 Running

Use the following command to run :

    pnpm dev

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

-   **[Submit Pull Requests](https://github.com/pratyush1712/Personal-Website/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
-   **[Join the Discussions](https://github.com/pratyush1712/Personal-Website/discussions)**: Share your insights, provide feedback, or ask questions.
-   **[Report Issues](https://github.com/pratyush1712/Personal-Website/issues)**: Submit bugs found or log feature requests for .

<details closed>
    <summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
    ```sh
    git clone https://github.com/pratyush1712/Personal-Website/
    ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
    ```sh
    git checkout -b new-feature-x
    ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
    ```sh
    git commit -m 'Implemented new feature x.'
    ```
6. **Push to GitHub**: Push the changes to your forked repository.
    ```sh
    git push origin new-feature-x
    ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---
