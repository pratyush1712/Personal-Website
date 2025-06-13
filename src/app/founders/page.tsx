import Video from "@/components/Video";

export default function HomePage() {
	return (
		<main className="p-6 max-w-4xl mx-auto">
			<Video id="video" alt="Founders discussing product roadmap" poster="/founders/video-poster.jpg" />
		</main>
	);
}
