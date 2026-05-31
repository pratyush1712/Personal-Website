# 🎯 Professional Experience

### **Full-Stack Developer** @ DECA Lab, Cornell University _(January 2025 – Present)_

DECA Lab builds tools for researchers and field workers - people operating in messy, real-world environments where connectivity is unreliable and data loss is unacceptable. My job was to build systems that accommodate that reality.

- Designed and built a full-stack audit platform with typed REST APIs supporting multi-role workflows - access control, draft saves, submission, and reporting - with i18n and accessibility configurations tailored for diverse field worker populations.
- Engineered an offline-first mobile app (Legend State + MMKV, background sync) that lets auditors start, pause, and resume field audits in low-connectivity environments without losing work. The design assumption: the network will fail. Build around that.
- Built normalized scoring pipelines with client-side CSV/XLSX/PDF export. Hardened draft-save flows against duplicate-key failures and extended data integrity guarantees across multi-round field testing.

_Technologies:_ `React Native` `Expo` `Next.js` `FastAPI` `SQLAlchemy` `PostgreSQL` `TypeScript`

---

### **Software Developer _(Contract)_** @ Halo - Wearable AI _(June 2025 – July 2025)_

Halo is building hardware-software systems for real-time social context. The challenge: getting face recognition to run fast enough to be useful, on an iOS device, pulling streams from embedded hardware.

- Orchestrated real-time iOS face recognition integrating ESP32 streams with Apple Vision Framework for instant social-profile aggregation and local face data management via REST APIs.
- Modularized a legacy UI codebase: 40% reduction in code redundancy, 30% reduction in app size, 25% faster streaming performance. Legacy code accumulates until someone decides it's worth fixing - I made that decision.
- Redesigned the Celery + Redis backend architecture with multi-layered OpenAI prompts, cutting face-search processing time from 3 minutes to under 50 seconds. That's the difference between a feature people use and one they abandon.

_Technologies:_ `Swift` `ESP32` `Celery` `Redis` `FastAPI` `OpenAI`

---

### **Computer Systems Developer** @ Rizvi Lab, Cornell University _(July 2024 – September 2024)_

Embedded systems work - the kind where the constraints are physical and the users aren't developers.

- Built a PyQt-based touchscreen GUI for BeagleBone hardware, enabling lab researchers to monitor and control food processing equipment without needing to touch a terminal.
- Wrote Linux shell scripts and cron jobs to automate system operations, removing manual steps from recurring tasks that researchers were doing by hand.

_Technologies:_ `Linux` `Shell Scripts` `PyQt4` `BeagleBone`

---

### **Software Engineering Intern** @ rapStudy _(June 2023 – August 2023)_

_Los Angeles, California_

rapStudy is an EdTech platform using music to teach literacy and reading comprehension. The technical challenge was performance and synchronization at scale.

- Refactored the codebase to Redux with memoization, improving frontend rendering speed by 93%. The app was slow in a way that mattered - users were dropping off during interactions. We fixed that.
- Architected a song-sharing feature using React, Firebase, and 10+ custom Firestore security rules, enabling controlled access for external users while maintaining platform integrity.
- Built a synchronized SongView component that displays lyrics in sync with playback at 95% accuracy, which is the kind of synchronization problem that sounds simple until you're debugging timing edge cases across variable network conditions.

_Technologies:_ `React.js` `Redux` `Firebase` `Firestore`

---

### **Data Engineer** @ Cornell College of Engineering _(June 2023 – September 2023)_

_Ithaca, New York_

- Built an ETL pipeline using Selenium and NLP to process financial data for 3,000+ companies, reducing processing time by 83% through parallel processing. The previous approach was sequential. Most slow pipelines are.
- Architected and deployed a full-stack application with Next.js and Flask, using Server-Sent Events for real-time data retrieval - 66% reduction in data latency compared to the polling approach it replaced.

_Technologies:_ `Next.js` `Flask` `Selenium` `NLP` `Server-Sent Events`

---

### **Software Developer** @ Cornell Yang-Tan Institute _(July 2022 – December 2022)_

_Ithaca, New York_

The Yang-Tan Institute focuses on disability employment research and policy. AskEarn.org is their public-facing resource hub, serving 100,000+ monthly active users.

- Built a flexible slug management system using PHP, Laravel, and Strapi CMS - a deceptively important feature. Clean, modifiable URLs directly affect SEO, content discoverability, and the ability of a non-technical team to manage their own site without developer intervention.

_Technologies:_ `PHP` `Laravel` `Strapi CMS`

---

### **Software Engineering Intern** @ Sellpoint _(June 2022 – August 2022)_

_Remote_

Sellpoint provides product content management for e-commerce. My work was full-stack across AWS services.

- Built an inventory management CRUD application on AWS: API Gateway for orchestration, ECR for containerized deployments, DynamoDB for database management.
- Developed a real-time market analysis tool processing data with Pandas and NumPy inside Lambda functions.
- Built the frontend in React.js with Redux, RTK Query, and react-apex-charts for data visualization.

_Technologies:_ `React.js` `Redux` `RTK Query` `AWS` `DynamoDB` `Lambda` `Pandas` `NumPy`
