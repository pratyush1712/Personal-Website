import dynamic from "next/dynamic";

export { default as CloseFriendsLayout } from "./CloseFriendsLayout";
export { default as Filters } from "./Filters";
export { default as DashboardLayout } from "./Admin/DashboardLayout";
export { default as VideoUploadForm } from "./Admin/VideoUpload";
export { default as Blogs } from "./Admin/Blogs/BlogsList";
export { default as ContentList } from "./Admin/ContentList";
export { default as BlogEditor } from "./Admin/Blogs/BlogEditor";
export { default as ContentDisplay } from "./ContentDisplay";
export { default as BlogsList } from "./Admin/Blogs/BlogsList";
export { default as VideosList } from "./Admin/Videos/VideosList";
const VideoEditor = dynamic(() => import("./Admin/Videos/VideoEditor"), { ssr: true });
export { VideoEditor };
