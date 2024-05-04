"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";
import { UploadBeforeHandler } from "suneditor-react/dist/types/upload";
import katex from "katex";
import "katex/dist/katex.min.css";

const MyComponent = (props: any) => {
	const editor = useRef<SunEditorCore>();
	const options = [
		// default
		["undo", "redo"],
		[":p-More Paragraph-default.more_paragraph", "font", "fontSize", "formatBlock", "paragraphStyle", "blockquote"],
		["bold", "underline", "italic", "strike", "subscript", "superscript"],
		["fontColor", "hiliteColor", "textStyle"],
		["removeFormat"],
		["outdent", "indent"],
		["align", "horizontalRule", "list", "lineHeight"],
		[
			"-right",
			":i-More Misc-default.more_vertical",
			"fullScreen",
			"showBlocks",
			"codeView",
			"preview",
			"print",
			"save",
			"template"
		],
		["-right", ":r-More Rich-default.more_plus", "table", "math", "imageGallery"],
		["-right", "image", "video", "audio", "link"],
		// (min-width: 992)
		[
			"%992",
			[
				["undo", "redo"],
				[":p-More Paragraph-default.more_paragraph", "font", "fontSize", "formatBlock", "paragraphStyle", "blockquote"],
				["bold", "underline", "italic", "strike"],
				[":t-More Text-default.more_text", "subscript", "superscript", "fontColor", "hiliteColor", "textStyle"],
				["removeFormat"],
				["outdent", "indent"],
				["align", "horizontalRule", "list", "lineHeight"],
				[
					"-right",
					":i-More Misc-default.more_vertical",
					"fullScreen",
					"showBlocks",
					"codeView",
					"preview",
					"print",
					"save",
					"template"
				],
				["-right", ":r-More Rich-default.more_plus", "table", "link", "image", "video", "audio", "math", "imageGallery"]
			]
		],
		// (min-width: 767)
		[
			"%767",
			[
				["undo", "redo"],
				[":p-More Paragraph-default.more_paragraph", "font", "fontSize", "formatBlock", "paragraphStyle", "blockquote"],
				[
					":t-More Text-default.more_text",
					"bold",
					"underline",
					"italic",
					"strike",
					"subscript",
					"superscript",
					"fontColor",
					"hiliteColor",
					"textStyle"
				],
				["removeFormat"],
				["outdent", "indent"],
				[":e-More Line-default.more_horizontal", "align", "horizontalRule", "list", "lineHeight"],
				[":r-More Rich-default.more_plus", "table", "link", "image", "video", "audio", "math", "imageGallery"],
				[
					"-right",
					":i-More Misc-default.more_vertical",
					"fullScreen",
					"showBlocks",
					"codeView",
					"preview",
					"print",
					"save",
					"template"
				]
			]
		],
		// (min-width: 480)
		[
			"%480",
			[
				["undo", "redo"],
				[":p-More Paragraph-default.more_paragraph", "font", "fontSize", "formatBlock", "paragraphStyle", "blockquote"],
				[
					":t-More Text-default.more_text",
					"bold",
					"underline",
					"italic",
					"strike",
					"subscript",
					"superscript",
					"fontColor",
					"hiliteColor",
					"textStyle",
					"removeFormat"
				],
				[":e-More Line-default.more_horizontal", "outdent", "indent", "align", "horizontalRule", "list", "lineHeight"],
				[":r-More Rich-default.more_plus", "table", "link", "image", "video", "audio", "math", "imageGallery"],
				[
					"-right",
					":i-More Misc-default.more_vertical",
					"fullScreen",
					"showBlocks",
					"codeView",
					"preview",
					"print",
					"save",
					"template"
				]
			]
		]
	];

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	const handleImageUploadBefore = (files: File[], info: object, uploadHandler: UploadBeforeHandler) => {
		const formData = new FormData();
		formData.append("image", files[0]);
		formData.append("type", "editor");
		fetch("/api/images", { method: "POST", body: formData })
			.then(response => response.json())
			.then(data => {
				const url = data[0];
				const name = files[0].name;
				const size = files[0].size;
				return uploadHandler({ result: [{ url, name, size }] });
			})
			.catch(error => {
				console.error("Error:", error);
				return false;
			});
		return undefined;
	};

	return (
		<SunEditor
			getSunEditorInstance={getSunEditorInstance}
			defaultValue={props.defaultValue}
			autoFocus={true}
			setOptions={{
				imageGalleryUrl: "/api/images?type=images",
				katex: katex,
				buttonList: options
			}}
			lang="en"
			height="100vh"
			placeholder="Please type here..."
			onImageUploadBefore={handleImageUploadBefore}
			onSave={props.onSave}
			onChange={props.onChange}
		/>
	);
};
export default MyComponent;
