import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import type { ClientActionFunctionArgs } from "@remix-run/react";
import { storyUpdate } from "~/commons/db.client";

export async function action({ request, params }: ActionFunctionArgs) {
	const id = params.id ? Number.parseInt(params.id, 10) : null;
	if (!id) {
		return redirect("/");
	}

	const form = await request.formData();

	const titleData = form.get("title") ?? "";
	const summaryData = form.get("summary") ?? "";
	const contentData = form.get("content") ?? "";

	if (
		typeof contentData !== "string" ||
		typeof titleData !== "string" ||
		typeof summaryData !== "string"
	) {
		return redirect(`/stories/${id}/view`);
	}

	const content = contentData.trim();
	if (!content) {
		return redirect(`/stories/${id}/view`);
	}

	return json({
		id,
		title: titleData.trim() || null,
		summary: summaryData.trim() || null,
		content,
	});
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
	const { id, title, summary, content } = await serverAction<typeof action>();

	const story = await storyUpdate({
		id,
		title,
		summary,
		content,
	});

	if (!story) {
		return redirect("/");
	}

	return redirect(`/stories/${story.id}/view`);
}
clientAction.hydrate = true;
