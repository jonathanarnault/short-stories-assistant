import { Ai } from "@cloudflare/ai";
import type { RoleScopedChatInput } from "@cloudflare/ai/dist/ai/tasks/text-generation";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { CREATE_STORY_SYSTEM_PROMPT } from "~/commons/const.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
	const ai = new Ai(context.cloudflare.env.AI);
	const { searchParams } = new URL(request.url);

	const prompt = searchParams.get("prompt");
	if (!prompt || typeof prompt !== "string") {
		throw new Response(null, {
			status: 400,
		});
	}

	const messages: RoleScopedChatInput[] = [
		{ role: "system", content: CREATE_STORY_SYSTEM_PROMPT },
		{
			role: "user",
			content: prompt,
		},
	];

	const stream = (await ai.run("@cf/mistral/mistral-7b-instruct-v0.1", {
		messages,
		stream: true,
	})) as ReadableStream;

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
		},
	});
}
