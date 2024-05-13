"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	console.error(error);
	return (
		<html>
			<body>
				<h2>Something went wrong!</h2>
				<p>{error.message}</p>
				<p>
					<details>
						<summary>Stack trace</summary>
						<pre>{error.stack}</pre>
						<pre>{error.digest}</pre>
					</details>
				</p>
				<button onClick={() => reset()}>Try again</button>
			</body>
		</html>
	);
}
