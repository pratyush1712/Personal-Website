import EmailTemplate from "@/ui/Email";
import { Resend } from "resend";
import { NextRequest } from "next/server";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
	const body = await req.formData();
	const fullName = body.get("name") as string;
	const email = body.get("email") as string;
	const message = body.get("message") as string;
	const EmailText = `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`;
	try {
		const { data, error } = await resend.emails.send({
			from: "Web Reach Out <contact@pratyushsudhakar.com>",
			to: ["ps2245@cornell.edu"],
			subject: "New message from your website",
			react: EmailTemplate({ fullName, email, message }) as React.ReactElement,
			text: EmailText
		});

		if (error) {
			console.error(error);
			return Response.json({ error }, { status: 500 });
		}

		return Response.redirect("https://pratyushsudhakar.com/contact");
	} catch (error) {
		console.error(error);
		return Response.json({ error }, { status: 500 });
	}
}
