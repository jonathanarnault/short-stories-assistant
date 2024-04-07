import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	Form,
	useLoaderData,
	type ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { storyFindById } from "~/commons/db.client";

export function loader({ params }: LoaderFunctionArgs) {
	const id = params.id ? Number.parseInt(params.id, 10) : null;
	if (!id) {
		return redirect("/");
	}

	return json({
		id,
		story: null,
	});
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
	const { id } = await serverLoader<typeof loader>();
	const story = await storyFindById(id);

	if (!story) {
		return redirect("/");
	}

	return json({
		id,
		story,
	});
}

clientLoader.hydrate = true;

export default function StoryDetail() {
	const { story } = useLoaderData<typeof clientLoader>();
	if (!story) {
		return null;
	}

	return (
		<Form
			className="flex flex-grow flex-col gap-2"
			action={`/stories/${story.id}/update`}
			method="POST"
		>
			<div className="flex flex-col gap-1 h-32">
				<label htmlFor="summary">Abstract</label>
				<textarea
					id="summary"
					name="summary"
					defaultValue={story.summary ?? ""}
					className="textarea textarea-primary resize-none flex-grow"
				/>
			</div>

			<div className="flex flex-grow flex-col gap-1">
				<label htmlFor="content">Story</label>
				<textarea
					id="content"
					name="content"
					defaultValue={story.content}
					className="textarea textarea-primary resize-none flex-grow"
				/>
			</div>

			<div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-4">
				<button
					type="submit"
					className="btn btn-primary lg:col-start-4 lg:col-end-4"
				>
					Save
				</button>
			</div>
		</Form>
	);
}
