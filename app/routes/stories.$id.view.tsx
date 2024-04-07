import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	Await,
	Form,
	useLoaderData,
	type ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { Suspense } from "react";
import { storyFindById, storyUpdate } from "~/commons/db.client";
import { generateImage, summarize } from "~/commons/service.client";
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

	const getTitle = async () => {
		if (!story.title) {
			story.title = await summarize(story.content, 24);
			await storyUpdate({
				id: story.id,
				title: story.title,
			});
		}

		return story.title;
	};

	const getSummary = async () => {
		if (!story.summary) {
			story.summary = await summarize(story.content, 512);
			await storyUpdate({
				id: story.id,
				summary: story.summary,
			});
		}

		return story.summary;
	};

	const summary = getSummary();

	const image = getSummary().then(async (summary) => {
		if (!summary) {
			return "";
		}

		if (!story.image) {
			story.image = await generateImage(summary);
			await storyUpdate({
				id: story.id,
				image: story.image,
			});
		}

		return story.image;
	});

	const { content } = story;
	return {
		id,
		story: {
			id,
			image: image,
			content,
			title: getTitle(),
			summary,
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
				<Suspense fallback={<Loader />}>
					<Await resolve={story.image}>
						{(image) => (
							<img
								src={image}
								alt="Story cover"
								className="h-full object-contain"
							/>
						)}
					</Await>
				</Suspense>
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="title">Title</label>
				<Suspense fallback={<Loader />}>
					<Await resolve={story.title}>
						{(title) => (
							<input
								type="text"
								id="title"
								name="title"
								value={title}
								className="input input-primary"
							/>
						)}
					</Await>
				</Suspense>
			</div>

			<div className="flex flex-col gap-1 h-32">
				<label htmlFor="summary">Abstract</label>
				<Suspense fallback={<Loader />}>
					<Await resolve={story.summary}>
						{(summary) => (
							<textarea
								id="summary"
								name="summary"
								value={summary}
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
					value={story.content}
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
