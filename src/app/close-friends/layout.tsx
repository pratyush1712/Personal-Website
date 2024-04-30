import { CloseFriendsLayout } from "@/components/CloseFriends";
import "../globals.css";
import { Inter } from "next/font/google";
import { ApolloProvider } from "@/graphql/apolloProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Pratyush's Personal Blog and Video Sharing Platform",
	description: "A personal blog and video sharing platform for my close friends",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ApolloProvider>
					<CloseFriendsLayout>{children}</CloseFriendsLayout>
				</ApolloProvider>
			</body>
		</html>
	);
}
