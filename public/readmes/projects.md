# 🧪 Projects

---

### [ADHD-Friendly Text Enhancer](https://chromewebstore.google.com/detail/adhd-friendly-text-enhancer/mnagpckgpcigjbenomcdpfifellpehnb) 🔗

[`Code 🔗`](https://github.com/pratyush1712/adhd-friendly-text-enhancer) | *Technologies:* `JavaScript` `HTML` `CSS` `Chrome APIs`

I have ADHD. Reading long web pages is hard. So I built a Chrome extension that applies bionic reading techniques - bolding the first few letters of each word, highlighting sentences in alternating colors - to reduce the cognitive load of tracking text on a page.

80+ people use it. I built it for myself and found out that other people had the same problem. That's usually how the best tools start.

---

### [Cornell Perfect Match - Matching Engine](https://perfectmatch.ai/) 🔗

*Technologies:* `Next.js` `TypeScript` `Flask` `Google OR-Tools` `Gale-Shapley` `MongoDB` `GCP` `Cron Jobs`

As Head of Engineering, I rebuilt the core matching system for a platform serving 5,000+ Cornell students. The previous approach was offline batch processing. We moved to real-time matching using the Gale-Shapley stable matching algorithm and Google OR-Tools for optimization.

The constraint wasn't just technical - it was fairness. Stable matching guarantees that no two people would mutually prefer each other over their assigned matches. That kind of mathematical guarantee matters when the output is a human relationship. We delivered 50,000+ matches. Cron-automated personalized emails grew active users by 600+.

---

### [DECA Lab Audit Platform](https://github.com/cornell-dti/)

*Technologies:* `React Native` `Expo` `Next.js` `FastAPI` `PostgreSQL` `SQLAlchemy` `TypeScript`

An offline-first mobile audit tool for field workers in low-connectivity environments. The core assumption I designed around: *the network will fail, and the user cannot lose their work when it does*.

Built with Legend State and MMKV for local persistence and background sync. Multi-role access control, draft-save flows hardened against duplicate-key failures, normalized scoring pipelines, and client-side export to CSV/XLSX/PDF. i18n and accessibility built in from the start, not retrofitted.

---

### [TimeBite](https://timebite.herokuapp.com/) 🔗

[`Code 🔗`](https://github.com/pratyush1712/Timebite-Backend/) | *Technologies:* `Flask` `Google OR-Tools` `HTML/CSS/JavaScript` `Docker` `GCP`

A schedule optimization web app using Mixed Integer Linear Programming. You enter your to-do list; OR-Tools produces an optimized ordering. Integrates with Google Calendar to export the result.

This was the project where I realized I genuinely enjoy optimization problems - not just implementing algorithms, but thinking about what it means to optimize for human preference rather than pure efficiency. The algorithm can minimize time. But should it? Or should it account for energy levels, task switching costs, and the fact that humans aren't machines?

---

### [DTI GPT](https://github.com/cornell-dti/mlmn-findoc/)

[`Code 🔗`](https://github.com/cornell-dti/mlmn-findoc/) | *Technologies:* `Supabase` `Next.js` `Flask` `LangChain` `Vector DB` `Azure`

An RAG-based tool for Cornell students to query course syllabuses in natural language. Ask a follow-up question about your CS syllabus and get a specific answer, instead of ctrl+F-ing through a PDF.

Built with Supabase for backend management, Zillus clusters for vector caching, LangChain for NLP, and Azure for backend deployment. The interesting problem was retrieval quality - vector search finds semantically similar content, but "semantically similar" and "actually relevant to this question" aren't always the same thing.

---

### [Personal Blog & Private Video Platform](https://private.pratyushsudhakar.com/)

[`Code 🔗`](https://github.com/pratyush1712/personal-website/) | *Technologies:* `Next.js 14` `Apollo` `GraphQL` `MongoDB` `Mux`

A private blog and live video sharing platform I built for sharing writing and video with friends. Uses Mux for live video streaming from my personal camera. GraphQL via Apollo for flexible content querying. Not everything needs to be public.

---

### [Harmonious Sounds](https://nginx-devops-pratyush1712.cloud.okteto.net/)

[`Code 🔗`](https://github.com/pratyush1712/react-express/) | *Technologies:* `React.js` `Express.js` `Docker` `Kubernetes` `GitHub Actions` `Nginx`

A microservices-architecture web app - client, server, and ML model - deployed on Kubernetes with full CI/CD via GitHub Actions. The educational goal was getting comfortable with DevOps infrastructure: containerization, preview environments, automated linting and building before merge. The kind of setup that lets other people contribute without breaking things.

---

### [Cornell Wushu Club Website](https://cornellwushu.github.io) 🔗

[`Code 🔗`](https://github.com/cornellwushu/cornellwushu.github.io/) | *Technologies:* `React.js` `AWS Amplify` `AWS DynamoDB` `AWS IVS`

Rebuilt the club website from scratch as VP. Many-to-many data model between members and events on DynamoDB. "Wushu Live" - a live streaming feature using AWS Interactive Video Services that broadcast performances at club events. CI/CD pipeline that auto-deploys when new members or performances are added to the database.

---

### [CaseOwl](https://caseowl.in/) 🔗

*Technologies:* `React` `Redux` `AWS Lambda` `AWS S3` `AWS Cognito`

A files and task management web app built for Indian lawyers. Secure document storage via S3, authentication via Cognito. The domain specificity mattered - legal workflows have particular requirements around access control and document integrity that a generic task app doesn't address.

---

### [Boss Mode - Focus Timer](https://github.com/pratyush1712/)

*Technologies:* `React Native` `Expo` `MongoDB Realm`

A cross-platform productivity app for managing focus sessions and task tracking, built with ADHD-related constraints in mind. Flexible focus timer, to-do list with historical logging, offline-first via MongoDB Realm. The premise: most productivity apps are built for people who don't struggle with productivity. This one isn't.

---

### [Wi-Find](https://github.com/Archit404Error/WiFindMobile/)

[`Backend 🔗`](https://github.com/Archit404Error/WiFindBackend/) | *Technologies:* `React Native` `Expo` `Node.js` `MongoDB`

A campus app helping ~20,000 Cornell students find high-speed wifi locations. Collects user location and bandwidth data, clusters it with an ML algorithm, and renders the results on a map view. Useful infrastructure problem: the data to solve it already exists in users' devices; the hard part is aggregating and classifying it.

---

### [Face Detect](https://cornell-detection.herokuapp.com/) 🔗

[`Code 🔗`](https://github.com/pratyush1712/face-detection/) | *Technologies:* `Flask` `OpenCV` `Haar Cascades` `React` `Docker`

A full-stack face and eye detection app using OpenCV's Haar Cascade classifier. Flask backend processes webcam frames; React frontend renders results. Built when I was first getting into computer vision - useful for learning how server-side image processing pipelines actually work.
