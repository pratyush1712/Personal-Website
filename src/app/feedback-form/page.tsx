"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";
import { Container } from "@mui/material";

const fetchLocation = async (router: any) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_RESTDB_URL!}/location`, {
		method: "GET",
		headers: {
			"cache-control": "no-cache",
			"Content-Type": "application/json",
			"x-apikey": process.env.NEXT_PUBLIC_RESTDB_KEY!
		}
	});
	const data = await res.json();
	await getClientLocation();
	if (data.length <= 2) {
		router.push("/?feedback=true");
	} else {
		window.location.href = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL!;
	}
};

const getClientLocation = async () => {
	try {
		const res = await fetch(`https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IP_TOKEN}`);
		const locationData = await res.json();

		await fetch(`${process.env.NEXT_PUBLIC_RESTDB_URL!}/location`, {
			method: "POST",
			headers: {
				"cache-control": "no-cache",
				"Content-Type": "application/json",
				"x-apikey": "673d7d6e126911526217aacb"
			},
			body: JSON.stringify(locationData)
		});
	} catch (error) {
		await fetch(`${process.env.NEXT_PUBLIC_RESTDB_URL!}/location`, {
			method: "POST",
			headers: {
				"cache-control": "no-cache",
				"Content-Type": "application/json",
				"x-apikey": "673d7d6e126911526217aacb"
			},
			body: JSON.stringify(error)
		});
		console.error(error);
	}
};

export default function RedirectToHome() {
	const router = useRouter();

	useEffect(() => {
		fetchLocation(router);
	}, [router]);

	return (
		<Container
			sx={{
				zIndex: 1000,
				background: "#1e1e1e",
				color: "#1e1e1e",
				backgroundColor: "#1e1e1e",
				width: "100vw",
				position: "fixed",
				left: 0,
				top: 0,
				height: "100vh"
			}}>
			<Loading />
		</Container>
	);
}
