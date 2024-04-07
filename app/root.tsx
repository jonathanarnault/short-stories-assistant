import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
} from "@remix-run/react";

import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";

import { storyList } from "~/commons/db.client";
import "./root.css";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export async function loader() {
	return json({
		stories: [],
	});
}

export async function clientLoader() {
	const stories = await storyList();
	return {
		stories,
	};
}

clientLoader.hydrate = true;

export default function App() {
	const { stories } = useLoaderData<typeof clientLoader>();
	return (
		<>
			<Header stories={stories} />
			<main>
				<Outlet />
			</main>
			<Footer />
		</>
	);
}
