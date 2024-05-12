# My VSCode-Themed Personal Website and Netflix-Themed Blogs and Videos Sharing Platform

-   Personal Portfolio Built Using Next.js 14 and Material UI: [Live Demo](https://pratyushsudhakar.com/)
-   Extended the Website to a Personal Blogs and Videos Sharing Platform Using Apollo GraphQL: [Live Demo](https://private.pratyushsudhakar.com/)

<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center"></h1>
</p>
<p align="center">
    <em>Crafting Web Presence With Personalized Excellence</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/pratyush1712/Personal-Website?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/pratyush1712/Personal-Website?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/pratyush1712/Personal-Website?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/pratyush1712/Personal-Website?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
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
> -   [📦 Features](#-features)
> -   [📂 Repository Structure](#-repository-structure)
> -   [🧩 Modules](#-modules)
> -   [🚀 Getting Started](#-getting-started)
>     -   [⚙️ Installation](#️-installation)
>     -   [🤖 Running ](#-running)
> -   [🤝 Contributing](#-contributing)

---

## 📍 Overview

The project is a personal website, built on Next.js, a JavaScript-based web application for efficient content presentation and project management. It employs automation workflows, including continuous integration, pull request management, and content updates. With static hosting for visual assets and configuration files for various dependencies, the website serves as a comprehensive, interactive portfolio for the user.

---

## 📦 Features

|  | Feature | Description |
| --- | --- | --- |
| ⚙️ | **Architecture** | The project is structured as a JavaScript-based web application using the Next.js framework. Workflow management, code governance, and content presentation are the central roles. |
| 🔩 | **Code Quality** | The codebase is maintained with TypeScript and appears well-organized. Conformity and consistency are upheld using eslint and prettier. |
| 🔌 | **Integrations** | Key integrations include Next.js, GraphQL, Apollo Server, AWS S3, MongoDB, Mux video, and Next-auth for authentication. |
| 🧩 | **Modularity** | The codebase appears modular, with distinct responsibilities being isolated well, enhancing readability and maintainability. |
| ⚡️ | **Performance** | As a Next.js application, it benefits from SSR for performance. Specific performance characteristics would need deeper investigation. |
| 🛡️ | **Security** | Uses Next-auth for authentication. AWS SDK potentially manages data security for any data stored in S3. Further security assessment required. |
| 📦 | **Dependencies** | Major dependencies include Next.js, Apollo, AWS SDK, MongoDB, Mux video, emotion for styling, Material UI, lodash, and Suneditor. |
| 🚀 | **Scalability** | The project, being based on the Next.js framework, inherentlys support scalability to a good degree. |

---

## 📂 Repository Structure

```sh
└── /
    ├── .github
    │   ├── PULL_REQUEST_TEMPLATE.md
    │   └── workflows
    │       ├── ci.yml
    │       └── update_songs.yml
    ├── README.md
    ├── next.config.js
    ├── package.json
    ├── pnpm-lock.yaml
    ├── public
    │   ├── ads.txt
    │   ├── extension_privacy.html
    │   ├── favicon.png
    │   ├── icons
    │   │   ├── orange_ribbon.ico
    │   │   └── teal_ribbon.ico
    │   ├── images
    │   │   ├── default.jpg
    │   │   └── login-background.png
    │   ├── readmes
    │   │   ├── affiliations.md
    │   │   ├── education.md
    │   │   ├── experience.md
    │   │   ├── overview.md
    │   │   ├── projects.md
    │   │   └── skills.md
    │   ├── resume.pdf
    │   ├── resume.tex
    │   └── videos
    │       ├── background.mp4
    │       └── get-started.mp4.json
    ├── spotify
    │   ├── .gitignore
    │   ├── data.py
    │   ├── index.py
    │   └── requirements.txt
    ├── src
    │   ├── app
    │   │   ├── (home)
    │   │   │   ├── [slug]
    │   │   │   │   └── page.tsx
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── Error
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── api
    │   │   │   ├── auth
    │   │   │   │   └── [...nextauth]
    │   │   │   ├── graphql
    │   │   │   │   └── route.ts
    │   │   │   ├── mux
    │   │   │   │   └── route.ts
    │   │   │   └── upload
    │   │   │       └── route.ts
    │   │   ├── close-friends
    │   │   │   ├── (home)
    │   │   │   │   ├── layout.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── admin
    │   │   │   │   ├── blogs
    │   │   │   │   ├── layout.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── videos
    │   │   │   ├── blog
    │   │   │   │   └── [id]
    │   │   │   ├── layout.tsx
    │   │   │   ├── sitemap.ts
    │   │   │   └── video
    │   │   │       └── [id]
    │   │   ├── favicon.ico
    │   │   ├── global-error.tsx
    │   │   ├── globals.css
    │   │   ├── login
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── manifest.ts
    │   │   ├── robots.txt
    │   │   └── sitemap.xml
    │   ├── components
    │   │   ├── CloseFriends
    │   │   │   ├── Admin
    │   │   │   │   ├── Blogs
    │   │   │   │   ├── DashboardLayout.tsx
    │   │   │   │   ├── VideoUpload.tsx
    │   │   │   │   └── Videos
    │   │   │   ├── Auth
    │   │   │   │   └── AuthLayout.tsx
    │   │   │   ├── Blogs
    │   │   │   │   ├── BlogLayout.tsx
    │   │   │   │   ├── BlogView.tsx
    │   │   │   │   └── Download.tsx
    │   │   │   ├── Layout
    │   │   │   │   ├── CloseFriendsLayout.tsx
    │   │   │   │   ├── ContentDisplay.tsx
    │   │   │   │   ├── Filters.tsx
    │   │   │   │   └── Footer.tsx
    │   │   │   ├── Videos
    │   │   │   │   ├── VideoDisplay.tsx
    │   │   │   │   └── VideoLayout.tsx
    │   │   │   └── index.tsx
    │   │   ├── HomeLayout
    │   │   │   ├── AppButtons.tsx
    │   │   │   ├── AppTree.tsx
    │   │   │   ├── Footer.tsx
    │   │   │   ├── Layout.tsx
    │   │   │   ├── PlayList.tsx
    │   │   │   └── Sidebar.tsx
    │   │   └── Markdown
    │   │       ├── CustomIcon.tsx
    │   │       └── Markdown.tsx
    │   ├── graphql
    │   │   ├── client
    │   │   │   ├── apolloClient.ts
    │   │   │   ├── apolloProvider.tsx
    │   │   │   └── queries.ts
    │   │   ├── database
    │   │   │   ├── controllers.ts
    │   │   │   └── models.ts
    │   │   ├── resolvers.ts
    │   │   └── schema.ts
    │   ├── middleware.ts
    │   ├── styles
    │   │   ├── editor.css
    │   │   ├── playlist.css
    │   │   └── scrollbar.css
    │   ├── types
    │   │   ├── close-friends.tsx
    │   │   ├── index.tsx
    │   │   ├── react-bubble-ui.d.ts
    │   │   └── video.d.ts
    │   ├── ui
    │   │   ├── Editor.tsx
    │   │   ├── Image.tsx
    │   │   ├── Keyboard.tsx
    │   │   ├── Loading.tsx
    │   │   ├── Theme.tsx
    │   │   └── Video.tsx
    │   └── utils
    │       ├── auth.ts
    │       ├── links.tsx
    │       ├── pages.ts
    │       ├── songs.json
    │       └── upload.tsx
    └── tsconfig.json
```

---

## 🧩 Modules

<details closed><summary>spotify</summary>

| File | Summary |
| --- | --- |
| [index.py](https://github.com/pratyush1712/Personal-Website/blob/master/spotify/index.py) | This code snippet indicates the structure of a repository for a web application, specifically detailing the directory organization and key files. Major roles include representing the application's frontend visuals (icons, images), providing configuration files (next.config.js, package.json), managing continuous integration workflows (.github), and housing the project's documentation (README.md, readmes). |
| [data.py](https://github.com/pratyush1712/Personal-Website/blob/master/spotify/data.py) | This code is responsible for managing the structure and automation in the repository. Primarily, it creates a streamlined process for handling pull requests, executing continuous integration, and updates to the songs database. Additionally, it maintains content, privacy details, and icons for the public directory, assisting in the repository's overall organization and functionality. |

</details>

<details closed><summary>.github.workflows</summary>

| File | Summary |
| --- | --- |
| [ci.yml](https://github.com/pratyush1712/Personal-Website/blob/master/.github/workflows/ci.yml) | This codebase primarily handles the setup and configuration for a music web application, maintained in a Next.js project. The.github directory manages GitHub actions and pull request templates, while the public directory hosts static files such as icons, images, and web exclusives. The overall architecture supports smooth CI/CD workflows, automated updates for song listings, and an appealing user interface with custom visuals. |
| [update_songs.yml](https://github.com/pratyush1712/Personal-Website/blob/master/.github/workflows/update_songs.yml) | This code snippet provides a snapshot of a JavaScript-based web app's file architecture. Key elements include a continuous integration workflow, an application configuration file, and various static resources. Its main function is to outline the infrastructure for the application, including the pull request procedure, automated tests, and regular song-related updates. It also hosts the application's public-facing components like icons, images, and privacy instructions. |

</details>

<details closed><summary>src</summary>

| File | Summary |
| --- | --- |
| [middleware.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/middleware.ts) | This code provides an overview of the project's main directory structure. It highlights important files and directories, including GitHub workflows, Next.js configurations, and the public folder which contains static files such as icons, images, and content for various web pages. It aids in maintaining project organization and contributing to the project's ongoing development. |

</details>

<details closed><summary>src.styles</summary>

| File | Summary |
| --- | --- |
| [editor.css](https://github.com/pratyush1712/Personal-Website/blob/master/src/styles/editor.css) | This code snippet is part of the repository's infrastructural configuration, playing a vital role in handling continuous integration and automated updates of songs. It's part of the GitHub workflows, enabling the efficient maintenance and enhancement of the project’s functionality. The code also works with other elements to support the overall operation, ensuring correctness and responsiveness of the music application. |
| [playlist.css](https://github.com/pratyush1712/Personal-Website/blob/master/src/styles/playlist.css) | This codebase appears to be a JavaScript-based web application, designed with the Next.js framework demonstrated by the next.config.js file. A notable feature of the code is its continuous integration pipeline, as indicated by the.github/workflows/ci.yml file. The inclusion of update_songs.yml hints at dynamic content updates, likely audio-related due to the reference to songs. The repository also has provisions for privacy and favicon settings with public contents like ads.txt and favicon.png. |
| [scrollbar.css](https://github.com/pratyush1712/Personal-Website/blob/master/src/styles/scrollbar.css) | This codebase is part of a web application that incorporates continuous integration workflows, pull request templates, and a robust front-end setup. The code strategically manages the application's configuration and dependencies, while maintaining an organized structure for public accessible resources such as images and icons. |

</details>

<details closed><summary>src.types</summary>

| File | Summary |
| --- | --- |
| [react-bubble-ui.d.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/types/react-bubble-ui.d.ts) | This codebase forms the foundation of a web application with extensive CI/CD methodology and content updates integrated. It includes script automations for pull requests and songs database updates. The clearly defined public directory further suggests extensive use of media elements for user interface enhancement. |
| [index.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/types/index.tsx) | This code structure belongs to a typical web application with continuous integration. It includes templates for pull requests, CI workflows, configurations, and public assets such as icons and images. The primary purpose appears to be managing and organizing application resources, and ensuring quality control through CI workflows. |
| [video.d.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/types/video.d.ts) | This code snippet forms an integral part of the web application's infrastructure, providing a structure for collaboration through PR templates and CI workflows. Additionally, it manages application configurations, dependencies lock file, and public assets like favicons, images, and privacy policy documents, playing a critical role in the application's user interface and performance. |
| [close-friends.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/types/close-friends.tsx) | This code illustrates the core organization of a music streaming app's repository. The inclusion of automated tasks under.github indicates a strong integration with Github actions for continuous integration and automatic song updates. The public directory appears to store publicly accessible resources like icons and images. The next.config.js implies usage of Next.js, indicating this app is server-side rendered for optimal performance and SEO benefits. |

</details>

<details closed><summary>src.graphql</summary>

| File | Summary |
| --- | --- |
| [schema.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/schema.ts) | This code provides a glimpse into the repository structure of a web project. The top-level directories hint at application interfaces like CI/CD pipelines (in.github), front-end files (in public), and configuration files (next.config.js, package.json). Overall, the code achieves organization and establishment of the main infrastructure for building, maintaining, and deploying a web application. |
| [resolvers.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/resolvers.ts) | This repository primarily supports the continuous integration/deployment processes of a web-based application, with GitHub workflows dedicated to distinct tasks. Additionally, it handles website aesthetic elements and frontend routing configuration, including image assets for UI, extension privacy policy, and favicons. A readmes section accommodates detailed documentation files. |

</details>

<details closed><summary>src.graphql.client</summary>

| File | Summary |
| --- | --- |
| [apolloProvider.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/client/apolloProvider.tsx) | This code showcases the structure of a repository primarily for a web project. It includes continuous integration workflows (.github/workflows), UI assets (public), a Next.js config file, package dependencies, and various READMEs. The code's function supports the repository's overall organization, continuous deployment, and UI rendering. |
| [queries.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/client/queries.ts) | This code snippet provides an overview of the repository's structure. It's a multimedia-based project, with workflows for continuous integration and songs update, a collection of static public assets like images and icons, and configuration files. The code orchestrates file organization and automated tasks, enhancing the application's efficiency and maintainability. |
| [apolloClient.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/client/apolloClient.ts) | This repository mainly hosts a web application with continuous integration workflows. The code handles the app configuration, package management, and public assets, including icons and images. The workflows aim to manage pull requests and update songs. Furthermore, the provision of privacy details and affiliation information enhance transparency and user engagement. |

</details>

<details closed><summary>src.graphql.database</summary>

| File | Summary |
| --- | --- |
| [models.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/database/models.ts) | This code depicts the file structure of a web application repository. It includes CI/CD workflows, pull request templates for GitHub, configuration files, public assets like images and icons, and HTML documentation. The repository's organization aids in managing different aspects of the web application, including continuous integration, visual components, and app configuration. |
| [controllers.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/graphql/database/controllers.ts) | This codebase forms the architecture for a web application. It includes workflows for continuous integration and updating content, PR template setup, and configuration files for the Next.js framework. The public directory contains static assets like images, icons, and HTML files. The architecture is designed for easy maintenance and efficient workflow, ensuring the smooth deployment and updating of the web app's contents. |

</details>

<details closed><summary>src.utils</summary>

| File | Summary |
| --- | --- |
| [songs.json](https://github.com/pratyush1712/Personal-Website/blob/master/src/utils/songs.json) | This code demonstrates the configuration and organization of a project employing a CI/CD workflow. Its main goal is to automatically build and update the song list, handle pull requests, and maintain system privacy. It also integrates cross-platform compatibility for browser extensions. |
| [pages.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/utils/pages.ts) | This code snippet provides an overview of the project's architecture, displaying crucial system files, workflows, and publicly accessible items like images or icons. The project appears to be a web-based application that leverages workflows for continuous integration and updates, potentially related to song management. |
| [links.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/utils/links.tsx) | This repository manages a web application, with a structure supporting CI/CD workflows, extension privacy policies, app iconography, and default imagery. Key scripts and configurations are in the root directory. The update song workflow and pull request template illustrate provisions for regular content updates and collaboration guidelines. |
| [auth.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/utils/auth.ts) | In the context of the repository architecture, this codebase primarily manages workflows for CI/CD processes and song updates, with additional features for configuring the application and handling public resources like images and icons. Its role spans across maintaining site functionality, facilitating continuous deployment and automating updates for song components. |
| [upload.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/utils/upload.tsx) | This code denotes the structure of a GitHub repository composed of automatic workflows, documentation files, and web application assets like image and icon files. It also contains configuration files&nbsp;for the development environment and package management. It plays a vital role in organizing these components, hence aiding in software development, version control, and continuous integration processes. |

</details>

<details closed><summary>src.ui</summary>

| File | Summary |
| --- | --- |
| [Theme.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/ui/Theme.tsx) | This code represents a structured, web-based application repository targeting continuous integration workflows. The key functionality focused on automated updates for song selections and handling pull requests. This repository also contains image resources, templates and configuration settings central to the application. |
| [Loading.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/ui/Loading.tsx) | This code snippet details an architecture of a robust software repository, notably used for an application that incorporates a continuous integration workflow. The main task executed by this codebase involves updating songs and automation of tasks, ensuring smooth functioning. By using this well-managed file structure, developers can easily locate, modify, and apply changes, facilitating the future development or debugging processes. |
| [Keyboard.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/ui/Keyboard.tsx) | This code snippet provides an outline of a web application's repository structure. Key aspects include workflows for continuous integration and updates, templates for pull requests, a folder for public accessible files such as images and icons, and a JavaScript configuration file, next.config.js, for the Next.js framework. |
| [Image.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/ui/Image.tsx) | The provided code is a summary of the repository structure of an application. It mainly contains platform configurations, workflows, and assets. It maintains the application's automatic operations (like updates and continuous integration), metadata, and design elements. The repository ensures seamless, automated, and visually coherent platform functionality. |
| [Editor.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/ui/Editor.tsx) | This code forms the backbone structure of the repository. It involves templates for pull requests, workflow configurations, project configurations, package dependencies, public assets, and markdown files. The mentioned code chiefly supports the continuous integration of the project, updates songs database, manages project dependencies, and holds important icons, images and readmes. |
| [Video.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/ui/Video.tsx) | This code provides a detailed outline of the repository's directory structure. It defines the key components and their corresponding locations, such as the pull request template, Continuous Integration workflow, and specific assets like icons and images. This information forms a crucial part of understanding how the entire codebase is organized and operates, bolstering maintainability and collaboration. |

</details>

<details closed><summary>src.components.Markdown</summary>

| File | Summary |
| --- | --- |
| [Markdown.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/Markdown/Markdown.tsx) | This is a repo for a web application, with scripts for Continuous Integration and periodic song database updates. It emphasizes the streaming of media files, managing icon sets, and maintaining privacy statements. The architecture allows smooth integration of features by separating concerns within the structured directories. |
| [CustomIcon.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/Markdown/CustomIcon.tsx) | This code snippet provides an overview of a repository structured for a Continuous Integration (CI) workflow. It includes workflow files responsible for automated actions such as updating songs and PR templates. The repository also contains resources like icons, images, configuration files, and READMEs, which support the application's functionality and aesthetics. |

</details>

<details closed><summary>src.components.CloseFriends</summary>

| File | Summary |
| --- | --- |
| [index.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/index.tsx) | This code snippet reveals the folder structure of a web-based project. Key components include templates for pull requests, continuous integration workflows, configurations for the Next.js framework, web assets like images and icons, and markdown files for documentation. It demonstrates the project's focus on structured workflows, frontend configurations, and content management. |

</details>

<details closed><summary>src.components.CloseFriends.Admin</summary>

| File | Summary |
| --- | --- |
| [VideoUpload.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/VideoUpload.tsx) | The snippet is part of a repository managing a web application. Core functionalities encompass configuring workflows for continuous integration and song updates, maintaining privacy policy and favicon files, providing UI assets such as images, and managing pull request templates. The code ensures smooth execution of these tasks to maintain the web app's functionality. |
| [DashboardLayout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/DashboardLayout.tsx) | This codebase forms the structure of a web application coupled with continuous integration. The main parts include automated workflows, configuration for a Next.js application, package dependencies, as well as public resources like icons, images, and metadata files. The code organizes the front-end UI for users, manages backend processes, and includes templates for contributions. |

</details>

<details closed><summary>src.components.CloseFriends.Admin.Blogs</summary>

| File | Summary |
| --- | --- |
| [BlogEditor.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/Blogs/BlogEditor.tsx) | This repository primarily holds the resources and configurations for a personal portfolio or resume styled web application. It contains workflows for handling pull requests and automated updates, as well as static contents for the portfolio such as favicon, images, and markdown files detailing education and experience. Moreover, it stores settings for the Next.js application in the next.config.js file. |
| [BlogsList.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/Blogs/BlogsList.tsx) | This repository houses a web-based project with automated workflows. It includes features for managing pull requests and updating song files, with public assets like icons and images. Key elements include configuration files and documentation. Notably, the next.config.js supports the operation and configuration of the Next.js framework, powering the application frontend. |

</details>

<details closed><summary>src.components.CloseFriends.Admin.Videos</summary>

| File | Summary |
| --- | --- |
| [VideoEditorTools.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/Videos/VideoEditorTools.tsx) | This code snippet showcases the skeleton of the storage organization in this repository. It reveals an architecture committed to continuous integration (CI) workflows, updates on song lists, as well as handling various public resources like icons, images, and privacy related details. In summary, this part of code forms the structural foundation of the repository, enabling seamless processes for developers and facilitating necessary visuals for users. |
| [VideoEditor.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/Videos/VideoEditor.tsx) | The provided code reveals a structured and organized repository containing continuous integration workflows, favicon, and images for the UI. Its central function is to provide templates, manage pull requests, perform regular updates, and handle data related to the user interface such as icons and images. It also includes markdown files for the display of affiliations, education, experience, projects, and skills on the public interface. |
| [VideoJS.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/Videos/VideoJS.tsx) | This codebase corresponds to a web application built with Next.js. The central focus of the repository is on continuous integration workflows and on managing and updating a variety of assets, such as images, icons, and READMEs. These are utilized for features like user login, privacy details, and affiliated content display. The repository maintains its dependencies using pnpm. |
| [VideosList.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Admin/Videos/VideosList.tsx) | This code snippet provides a glimpse of the structure of a web-based application. It highlights continuous integration workflows, pull request templates, website assets, and other configuration files. This structure aids in streamlining the development process, website deployment, and content updating. |

</details>

<details closed><summary>src.components.CloseFriends.Blogs</summary>

| File | Summary |
| --- | --- |
| [BlogView.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Blogs/BlogView.tsx) | This code snippet provides an outline of the repository's structures and files, enabling smooth workflow management. The presence of GitHub workflows, a README file, package configurations, public assets, and images exhibits an organized architecture, facilitating functionality like continuous integration, external visibility, project configuration, and interface design. |
| [Download.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Blogs/Download.tsx) | This repository structure supports a web application, with continuous integration pipelines, managed dependencies, and a public folder for assets. Primarily, it contains configuration and workflow files for GitHub actions, graphical assets like icons and images, and content for the application like automated updates for songs. |
| [BlogLayout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Blogs/BlogLayout.tsx) | This code provides an organized view of the structure of a typical JavaScript-based project repository. It emphasizes the role and design of the GitHub repository in handling pull requests and workflows, and indicates the storage and management of dependencies, public assets including images, icons, and privacy documents. |

</details>

<details closed><summary>src.components.CloseFriends.Layout</summary>

| File | Summary |
| --- | --- |
| [Footer.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Layout/Footer.tsx) | This code represents a repository structure, mostly designed for a web application. The core files handle application configuration, package installation, continuous integration, and update workflows. It also includes directories for public web assets like icons, images and additional markdown files. |
| [Filters.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Layout/Filters.tsx) | This code relates to the configuration and structure of an application primarily using JavaScript. It encompasses process workflows (CI and song updates), pull request templates, and website asset management (like images, icons, and readmes). Essential parts also include privacy guidelines for an extension, and various configurations for project setup. |
| [ContentDisplay.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Layout/ContentDisplay.tsx) | This code specifies the file architecture of a software repository, showcasing an organized structure that includes templates, workflows, configuration files, project dependencies, and various public assets like icons, images and readme files. It primarily determines the structure and operation of the repository, allowing for effective collaborative development and automated tasks. |
| [CloseFriendsLayout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Layout/CloseFriendsLayout.tsx) | This repository appears to be a web application, possibly a music platform with continuous integration set-up. The mentioned code is likely in the `update_songs.yml` file, which suggests an automatic update for songs, crucial for maintaining fresh content. Further, the presence of readmes for various sections hints at a well-documented architecture. |

</details>

<details closed><summary>src.components.CloseFriends.Videos</summary>

| File | Summary |
| --- | --- |
| [VideoDisplay.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Videos/VideoDisplay.tsx) | The provided codebase represents a Next.js project with a GitHub CI/CD pipeline. It includes configuration files, templates for Pull Requests, automated workflows, as well as static public assets such as images and icons. The main role of this structure is to facilitate web app development, continuous integration and deployment, along with the management of public assets. |
| [VideoLayout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Videos/VideoLayout.tsx) | This code snippet illustrates the structure of a web-based application's repository, particularly designed for CI/CD workflows with a focus on privacy policies and multifarious visuals, managed by GitHub. Additionally, it maintains the application’s configuration and dependency files to secure effective operability, along with automated update capabilities for dynamic content such as songs. |

</details>

<details closed><summary>src.components.CloseFriends.Auth</summary>

| File | Summary |
| --- | --- |
| [AuthLayout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/CloseFriends/Auth/AuthLayout.tsx) | This code displays the repository structure for a web application. The repository mainly includes configuration files, continuous integration workflows, package details, and public-facing resources like icons, images, and documents. The architecture is designed to support standardized pull requests, automated workflows, package management, and public image resources, contributing to efficient development and deployment of the application. |

</details>

<details closed><summary>src.components.HomeLayout</summary>

| File | Summary |
| --- | --- |
| [Footer.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/HomeLayout/Footer.tsx) | This repository architecture suggests a web-based project, mainly leveraging Next.js. Essential elements include continuous integration workflows maintained under.github, browser extensions, and core application setup files. The public directory contains static assets like images and icons used in the UI, along with informational readmes. |
| [AppTree.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/HomeLayout/AppTree.tsx) | The codebase structure indicates a project related to web development, likely utilizing the Next.js framework. Key aspects include handling pull requests, continuous integration (CI) workflows, and updates to the song database. There is also provision for public web assets like images, favicons, privacy pages, and information readmes. It supports user interface customization with different icon options. |
| [AppButtons.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/HomeLayout/AppButtons.tsx) | This repository is dedicated to a web-based application, handling various workflows like continuous integration and the update of song data. It features a front end implemented in Next.js, with associated configuration and privacy declaration. Additionally, the repository includes sets of icons and images supporting the application's UI and README files detailing various aspects of the user's profile. |
| [PlayList.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/HomeLayout/PlayList.tsx) | The given repository contains the framework for a web-based application with continuous integration workflows. Crucial elements include the codebase's configuration files that ensure seamless deployment, as well as assets for frontend presentation like icons, images and incorporated documents. The pull request template enforces a standardized process for code contribution and review. |
| [Layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/HomeLayout/Layout.tsx) | This repository primarily serves as a personal portfolio webpage. It contains templates, workflows for continuous integration and song updates, configuration files, and assets such as icons, images, and PDFs. The readmes contain details about affiliations, education, experience, overview, projects, and skills. Automated workflows ensure the webpage remains up-to-date. |
| [Sidebar.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/components/HomeLayout/Sidebar.tsx) | This code details the repository structure for a web application, emphasizing the organization of its different elements. Critically, the application uses continuous integration workflows, defined in the.github directory, and maintains webpage resources in the public directory. Graphic assets, privacy details, and several README files are also part of this structure, which indicates a well-organized and healthily maintained codebase. |

</details>

<details closed><summary>src.app</summary>

| File | Summary |
| --- | --- |
| [manifest.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/manifest.ts) | The purpose of this code is to manage applications templates, workflows, configurations, and public assets such as icons, images, and readmes, contributing to the seamless functioning of the main software. It orchestrates both front-end visual elements and back-end operational procedures, playing an integral role in the repository's architecture. |
| [globals.css](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/globals.css) | This code snippet showcases the repository structure of a Next.js application with CI/CD workflows configured through GitHub actions. Key features include periodic song updates, a dedicated public directory housing static resources like images and icons, and scripts for managing pull requests. It also uses pnpm for dependency management, pointing to an emphasis on efficient, deterministic module installation. |
| [robots.txt](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/robots.txt) | The described codebase is primarily for a web application, likely built with Next.js given the presence of `next.config.js`. Key functions include continuous integration (CI), pull requests, and song updates, managed via GitHub actions. The public directory contains various media files such as images and icons, probably for UI/UX design. The application may include an extension, as suggested by `extension_privacy.html`. |
| [global-error.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/global-error.tsx) | This code forms part of a broader architecture handling a web application. It includes resources such as images and icons, workflow configurations, including Continuous Integration (CI) and Song Updates and has structured templates for Pull Requests. It deploys on a Next.js framework and utilizes the pnpm package manager, featuring unique configurations in the next.config.js file. |

</details>

<details closed><summary>src.app.close-friends</summary>

| File | Summary |
| --- | --- |
| [sitemap.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/sitemap.ts) | This code snippet delineates the folder structure of a music application's repository. Essential features include two workflows for continuous integration and song updates, privacy documents, and various image assets. The structure supports the multi-faceted app aspects, from front-end visuals to back-end automation. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/layout.tsx) | The given codebase pertains to a web application featuring UI functions and Continuous Integration (CI) setups. It contains automated actions for pull requests and updates, while housing public-facing assets like icons and images. Config files establish the environment settings, while the readmes folder provides user guidelines. |

</details>

<details closed><summary>src.app.close-friends.admin</summary>

| File | Summary |
| --- | --- |
| [loading.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/loading.tsx) | This software architecture is designed for a web application that employs continuous integration pipelines. The main components include update workflows for managing songs, pull request templates for streamlining contributions, and static assets management. The code primarily facilitates dynamic web page generation, client-side interactivity, as well as update and CI workflows. |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/page.tsx) | The given codebase represents a structured Javascript-based web application, with automated workflows and document templates for team collaboration. Its key feature lies in serving dynamic content with custom configurations at runtime, displaying custom media such as images and icons, while enforcing privacy and advertising standards. It also organizes key user documents for quick retrieval as needed. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/layout.tsx) | The code snippet represents the hierarchical structure of a repository. Key elements include Github workflows for continuous integration and song updates, configuration files, and a public directory holding various static assets like icons, images, and readme files. Overall, the repository organizes the codebase, ensuring easy navigation and efficient development cycle. |

</details>

<details closed><summary>src.app.close-friends.admin.videos</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/videos/page.tsx) | The codebase supports an application with CI/CD workflows, configured with attention to privacy and user customization. Important components include handling pull requests, regularly updating song data, managing dependencies, and providing public assets including images and icons. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/videos/layout.tsx) | This code snippet outlines the structure of a web application repository. It includes templates and workflows for GitHub, the app's configuration files, and public resources such as images, icons, and README files. It highlights practices for organizing resources and automation of certain tasks like code integration and song updates. |

</details>

<details closed><summary>src.app.close-friends.admin.videos.[id]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/videos/[id]/page.tsx) | This repository contains a web-based application. The infrastructure includes workflows for continuous integration and automatic updates. There are primarily static assets stored in the public folder for UI needs. The app uses the next.js framework and dependencies defined in package.json. It follows a conventional project structure with git PR templates, README, and a lock file for tighter dependency control. |

</details>

<details closed><summary>src.app.close-friends.admin.blogs</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/blogs/page.tsx) | The concerned code snippet pertains to a repository primarily structured for continuous integration, updates, and web development. It plays a key role in managing updates, maintaining web privacy and visual elements like icons and images, and handling pull requests within the parent repository. The code thereby helps streamline the web development workflow and repository performance. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/blogs/layout.tsx) | This repository is primarily set up to manage an application likely utilizing the Next.js framework. The main assets, icons, and images used in the application are stored in the public directory. The.github directory maintains workflows and standards for code contribution, whereas the next.config.js file presumably assists in customizing the behavior of the Next.js framework. |

</details>

<details closed><summary>src.app.close-friends.admin.blogs.[id]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/admin/blogs/[id]/page.tsx) | This code snippet provides a snapshot of the project's repository structure. Essential elements include workflows for continuous integration and song updates, as well as front-end resources like icons and images. Detailing these folders and files helps identify their role in driving web interface design, automated operations, and version control functionalities. |

</details>

<details closed><summary>src.app.close-friends.blog.[id]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/blog/[id]/page.tsx) | This codebase manages the framework for a web application, supporting processes such as Continuous Integration, automated updates, and pull request management. Other features include webpage configuration, privacy settings, and customization options via icon and image assets. The codebase also incorporates instructions for user engagement through README files for different sectors like education and experience. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/blog/[id]/layout.tsx) | This repository is primarily structured for a web-based application. The prominent features include the cohesive CI/CD workflows in.github, necessary configurations in next.config.js, and the public directory, hosting essential static assets. The application's functionality is automated via custom-designed workflows, supplemented by plentiful visual resources for an enhanced user interface. |

</details>

<details closed><summary>src.app.close-friends.(home)</summary>

| File | Summary |
| --- | --- |
| [page.tsx](<https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/(home)/page.tsx>) | This repository is designed to support a web-based application, with automated workflows for integration and updates. Key elements include application code, CI/CD workflows, app icons, images, and public-facing content like privacy details and readme files. The `update_songs.yml` and `next.config.js` notably relate to data updates and overall app configuration. |
| [layout.tsx](<https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/(home)/layout.tsx>) | This code snippet structures an application repository emphasizing version control, continuous integration actions, and static file hosting. Key features include templates for pull requests, workflow actions such as update_songs and ci pipeline configurations, and management of public assets like icons and images. |

</details>

<details closed><summary>src.app.close-friends.video.[id]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/video/[id]/page.tsx) | This repository encapsulates a web application primarily supported by Next.js. The prevalent files indicate functionalities such as continuous integration, automatic song updates, and templated pull requests. Publicly accessible assets include icons, images, and HTML files, assisting in rendering the front-end. Furthermore, Markdown files, serving as metadata or documentation, detail various components and past experiences. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/close-friends/video/[id]/layout.tsx) | This code snippet shows the structure layout of a repository for a web app possibly built with Next.js, indicating the presence of continuous integration workflows, pull request templates, and public web assets like icons, images, and some markdown documents. The update_songs.yml suggests that this repository also handles song updates. |

</details>

<details closed><summary>src.app.(home)</summary>

| File | Summary |
| --- | --- |
| [page.tsx](<https://github.com/pratyush1712/Personal-Website/blob/master/src/app/(home)/page.tsx>) | This code is responsible for maintaining the repository structure, which includes handling pull requests (PULL_REQUEST_TEMPLATE.md), running workflows (ci.yml and update_songs.yml), and managing project dependencies (package.json, pnpm-lock.yaml). Additionally, it helps in serving static files like images, icons, and privacy regulations (within public directory). Needless to mention, it houses the main application config file (next.config.js) as well. |
| [layout.tsx](<https://github.com/pratyush1712/Personal-Website/blob/master/src/app/(home)/layout.tsx>) | This code snippet is a visual representation of the file structure within the repository. It includes various elements such as templates for pull requests, workflow configurations, website configuration, package details, lock files, and public-facing assets such as icons, images, readmes, and favicon. The structure primarily supports continuous integration, web development, and documentation work, ensuring smooth control and operation of the project. |

</details>

<details closed><summary>src.app.(home).[slug]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](<https://github.com/pratyush1712/Personal-Website/blob/master/src/app/(home)/[slug]/page.tsx>) | The given codebase structure suggests it's for a web application leveraging Next.js, a React framework. Crucial features include continuous integration workflows through GitHub Actions, an update mechanism for songs, image and icon storage for user interface elements, and detailed documentation in markdown files. It also uses PNPM for managing dependencies, signified by the pnpm-lock.yaml file. |

</details>

<details closed><summary>src.app.api.mux</summary>

| File | Summary |
| --- | --- |
| [route.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/api/mux/route.ts) | The provided codebase appears to be for a web application, potentially with a music/song-related feature (based on update_songs.yml). It uses Continuous Integration workflows and a Next.js framework, as indicated by ci.yml and next.config.js. It also consists of public-facing assets such as images, icons, and privacy policy. |

</details>

<details closed><summary>src.app.api.graphql</summary>

| File | Summary |
| --- | --- |
| [route.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/api/graphql/route.ts) | This code is part of a repository for a web project, managing key files for configurations, workflows, and static content. It illustrates a well-structured, Github-integrated setup, with continuous integration capabilitiesand automation for song updates. There's also a designated public directory which includes essential assets like images and icons, alongside privacy policy files and readme files for distinct categories. |

</details>

<details closed><summary>src.app.api.auth.[...nextauth]</summary>

| File | Summary |
| --- | --- |
| [route.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/api/auth/[...nextauth]/route.ts) | The code snippet is part of a larger repository built with a tech stack that includes Next.js. The repository includes workflow automation files for Continous Integration and song updates, based on Github Actions. Furthermore, the web application serves frontend assets-images, favicons, and static HTML privacy information-from the public directory. The package.json and pnpm-lock.yaml files indicate the use of the pnpm package manager. |

</details>

<details closed><summary>src.app.api.upload</summary>

| File | Summary |
| --- | --- |
| [route.ts](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/api/upload/route.ts) | The provided code snippet is part of a music application's repository, ensuring the automatic update of songs playlists. It manages continuous integration workflows and handles extension privacy. The repository also controls visual elements like icons and images. Convenient templates for PRs are defined, improving collaboration and streamlining updates. |

</details>

<details closed><summary>src.app.Error</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/Error/page.tsx) | This code snippet represents the structure of a web application repository with Continuous Integration (CI) capabilities. Essential elements include templates for pull requests, CI workflows, configuration files, static public resources like images and icons, and informational readmes. The structure supports automated testing, regular updates, and privacy-aware features. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/Error/layout.tsx) | This code forms part of an infrastructure repository set up for a web application, focusing on continuous integration, workflow automation, and managing the application's static and media assets. It significantly contributes to the automated testing of the app, automatic updating of songs, and asset management. |

</details>

<details closed><summary>src.app.login</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/login/page.tsx) | This repository is designed to support the development of a web application. Among other functions, it manages CI workflows, updates songs for music functionalities, provides templates for pull requests, and stores key application elements like icons and images. The next.config.js file suggests it's built in Next.js. |
| [layout.tsx](https://github.com/pratyush1712/Personal-Website/blob/master/src/app/login/layout.tsx) | This repository is structured for a Next.js project with continuous integration workflows. The key feature of the codebase is the automated update of song entries through a GitHub action (update_songs.yml). Additional elements include templates for pull requests, different icon sets for interface personalization, and public reading materials linked in the user interface. |

</details>

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

```sh
pnpm build && pnpm start
```

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
