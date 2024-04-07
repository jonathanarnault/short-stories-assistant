import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	Await,
	Form,
	useLoaderData,
	type ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { Suspense } from "react";
import { storyFindById, storyUpdate } from "~/commons/db.client";
import { summarize } from "~/commons/service.client";
import { Loader } from "~/components/Loader";

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

	const getSummary = async () => {
		if (!story.summary) {
			story.summary = await summarize(story.content);
			await storyUpdate({
				id: story.id,
				summary: story.summary,
			});
		}

		return story.summary;
	};

	const { content } = story;
	return {
		id,
		story: {
			id,
			content,
			summary: getSummary(),
		},
	};
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
				<Suspense fallback={<Loader />}>
					<Await resolve={story.summary}>
						{(summary) => (
							<textarea
								id="summary"
								name="summary"
								defaultValue={summary}
								className="textarea textarea-primary resize-none flex-grow"
							/>
						)}
					</Await>
				</Suspense>
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
