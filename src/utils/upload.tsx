import SunEditor from "suneditor/src/lib/core";

interface UploadPDF {
	editor: SunEditor;
	blog: any;
}

const APIUrl = process.env.NEXT_PUBLIC_PDF_URL!;
export const pdfAPI = async (data: any, blog: any) => {
	const response = await fetch(APIUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	const blob = await response.blob();
	download(blob, blog.title + ".pdf");

	// uploading to s3
	const formData = new FormData();
	formData.append("file", blob, blog.title + ".pdf");
	formData.append("type", "pdf");
	const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });

	const uploadData = await uploadResponse.json();
	return uploadData;
};

export const download = (blob: Blob | MediaSource, filename: string) => {
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.style.display = "none";
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
};

export const uploadPDF = async ({ editor, blog }: UploadPDF) => {
	const iframe = document.createElement("iframe");
	iframe.style.display = "none";
	document.body.appendChild(iframe);

	let contentsHTML = "";
	if (editor?.core?.options.printTemplate) {
		const template = editor?.core?.options.printTemplate;
		contentsHTML = template.replace(/\{\{\s*contents\s*\}\}/i, editor?.getContents ? editor?.getContents(true) : "");
	} else if (editor?.getContents) contentsHTML = editor?.getContents(true);

	const printDocument = iframe.contentWindow?.document!;
	const wDoc = document;
	if (editor?.core?.options.iframe) {
		let arrts = "";
		if (editor?.core.options._printClass !== null) {
			arrts = 'class="' + editor?.core.options._printClass + '"';
		} else if (editor?.core.options.fullPage) {
			arrts = editor?.util?.getAttributesToString(wDoc.body, ["contenteditable"]);
		} else arrts = 'class="' + editor?.core.options.className + '"';

		printDocument.write(
			"" +
				"<!DOCTYPE html><html>" +
				"<head>" +
				wDoc.head.innerHTML +
				"</head>" +
				"<body " +
				arrts +
				">" +
				contentsHTML +
				"</body>" +
				"</html>"
		);
	} else {
		const links = wDoc.head.getElementsByTagName("link");
		const styles = wDoc.head.getElementsByTagName("style");
		let linkHTML = "";
		for (let i = 0, len = links.length; i < len; i++) linkHTML += links[i].outerHTML;
		for (let i = 0, len = styles.length; i < len; i++) linkHTML += styles[i].outerHTML;

		const bodyClass = editor?.core?.options._printClass !== null ? editor?.core?.options._printClass : editor?.core.options.className;
		printDocument.write(
			"" +
				"<!DOCTYPE html><html>" +
				"<head>" +
				linkHTML +
				"</head>" +
				'<body class="' +
				bodyClass +
				'">' +
				contentsHTML +
				"</body>" +
				"</html>"
		);
	}

	printDocument.querySelectorAll("link[href^='/_next']").forEach(link => {
		link.setAttribute("href", "https://pratyushsudhakar.com" + link.getAttribute("href"));
	});

	const htmlContent = printDocument.documentElement.outerHTML;
	const htmlContentWithBlackColors = htmlContent.replace(/color:#FFFFFF/g, "color:#000000");
	const data = {
		html: htmlContentWithBlackColors,
		options: {
			excludeBuiltinStyles: false,
			landscape: false,
			margins: { bottom: 20, left: 25, right: 25, top: 25 },
			pageFormat: "A4",
			pageSize: { height: 297, width: 210 }
		}
	};

	const response = await pdfAPI(data, blog);
	return response;
};
