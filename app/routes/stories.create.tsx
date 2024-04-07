import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import type { ClientActionFunctionArgs } from "@remix-run/react";
import { storyCreate } from "~/commons/db.client";

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData();
	const contentData = form.get("content") ?? "";

	if (typeof contentData !== "string") {
		return redirect("/");
	}

	const content = contentData.trim();
	if (!content) {
		return redirect("/");
	}

	return json({
		content,
	});
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
	const { content } = await serverAction<typeof action>();

	const story = await storyCreate({
		image: null,
		summary: null,
		content,
	});

	return redirect(`/stories/${story.id}/view`);
}
clientAction.hydrate = true;
