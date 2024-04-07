import type { MetaDescriptor } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";

export function meta(): MetaDescriptor[] {
	return [
		{ title: "Short Stories Assistant" },
		{
			name: "description",
			content: "An AI-based assistant that helps you write short stories.",
		},
	];
}

export default function Index() {
	return (
		<Form
			className="flex flex-grow flex-col gap-2"
			action="/stories/new"
			method="POST"
		>
			<label htmlFor="promp">Prompt for a story</label>

			<textarea
				id="prompt"
				name="prompt"
				className="textarea textarea-primary resize-none flex-grow"
				defaultValue="a love story between and angel and a demon"
			/>

			<div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-4">
				<button
					type="submit"
					className="btn btn-primary lg:col-start-4 lg:col-end-4"
				>
					Generate a story
				</button>

				<button
					type="button"
					className="btn btn-ghost lg:col-start-3 lg:col-end-3 lg:row-start-1"
					disabled
				>
					Import audio
				</button>
			</div>
		</Form>
	);
}
