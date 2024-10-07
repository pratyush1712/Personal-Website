import { Metadata } from "next";
import NeurodivergentExperienceDiagram from "@/components/BrainLayout/Experience";

export const metadata: Metadata = {
	title: "Pratyush | Neurodivergent Brain",
	description: "Pratyush Sudhakar's neurodivergent experience diagram.",
	robots: "noindex, nofollow",
	keywords: [
		"Pratyush Sudhakar Neurodivergent",
		"Pratyush Sudhakar Neurodivergent Brain",
		"Pratyush Sudhakar Neurodivergent Experience",
		"Pratyush Neurodivergent",
		"Pratyush Neurodivergent Brain",
		"Pratyush Neurodivergent Experience"
	]
};

export default function Page() {
	return <NeurodivergentExperienceDiagram />;
}
