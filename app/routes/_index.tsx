import type { MetaFunction } from "@remix-run/cloudflare";
import Home from "~/components/home/Home";

export const meta: MetaFunction = () => {
	return [
		{ title: "Short Stories Assistant" },
		{
			name: "description",
			content: "An AI-based assistant that helps you write short stories.",
		},
	];
};

export default function Index() {
	return <Home />;
}
