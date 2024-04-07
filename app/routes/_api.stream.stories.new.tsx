import { Ai } from "@cloudflare/ai";
import type { RoleScopedChatInput } from "@cloudflare/ai/dist/ai/tasks/text-generation";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { CREATE_STORY_SYSTEM_PROMPT } from "~/commons/const.server";

type SupportedModelTypes =
	| "@cf/mistral/mistral-7b-instruct-v0.1"
	| "@cf/meta/llama-2-7b-chat-int8"
	| "@hf/thebloke/llama-2-13b-chat-awq";

const SUPPORTED_MODELS: Record<string, SupportedModelTypes> = {
	"mistral-7b": "@cf/mistral/mistral-7b-instruct-v0.1",
	"llama2-7b": "@cf/meta/llama-2-7b-chat-int8",
	"llama2-13b": "@hf/thebloke/llama-2-13b-chat-awq",
};

export async function loader({ request, context }: LoaderFunctionArgs) {
	const ai = new Ai(context.cloudflare.env.AI);
	const { searchParams } = new URL(request.url);

	let model = searchParams.get("model") ?? "";
	if (!model || !SUPPORTED_MODELS[model]) {
		model = "mistral-7b";
	}

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

	const stream = (await ai.run(SUPPORTED_MODELS[model], {
		messages,
		stream: true,
	})) as ReadableStream;

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
		},
	});
}
