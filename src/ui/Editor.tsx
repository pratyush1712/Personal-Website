"use client";
import { useRef } from "react";
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";
import dynamic from "next/dynamic";
import { UploadBeforeHandler, UploadBeforeReturn, UploadInfo } from "suneditor-react/dist/types/upload";

const MyComponent = (props: any) => {
	const editor = useRef<SunEditorCore>();

	const options = [
		["undo", "redo"],
		["font", "fontSize", "formatBlock"],
		["bold", "underline", "italic", "strike", "subscript", "superscript"],
		["removeFormat"],
		["fontColor", "hiliteColor"],
		["outdent", "indent"],
		["align", "horizontalRule", "list", "table"],
		["link", "image", "video"],
		["fullScreen", "showBlocks", "codeView"],
		["preview", "print"],
		["save"]
	];

	const handleImageUpload = (
		targetImgElement: HTMLImageElement,
		index: number,
		state: "create" | "update" | "delete",
		imageInfo: UploadInfo<HTMLImageElement>,
		remainingFilesCount: number
	) => {
		if (!imageInfo?.name || !imageInfo?.src) {
			return;
		}
		imageInfo.src = "https://privatewebsitecontent.s3.amazonaws.com/editor/" + imageInfo.name;
		targetImgElement.src = imageInfo.src;
		editor.current?.save();
		return imageInfo;
	};

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	const handleImageUploadBefore = (files: File[], info: object, uploadHandler: UploadBeforeHandler) => {
		const formData = new FormData();
		formData.append("image", files[0]);
		formData.append("type", "editor");
		fetch("/api/images", { method: "POST", body: formData })
			.then(response => response.json())
			.then(data => true)
			.catch(error => {
				console.error("Error:", error);
				return false;
			});
		return true;
	};

	return (
		<SunEditor
			getSunEditorInstance={getSunEditorInstance}
			defaultValue={props.defaultValue}
			setOptions={{ buttonList: options }}
			lang="en"
			height="100vh"
			placeholder="Please type here..."
			onImageUploadBefore={handleImageUploadBefore}
			onImageUpload={handleImageUpload}
			onSave={props.onSave}
			onChange={props.onChange}
		/>
	);
};
export default MyComponent;
