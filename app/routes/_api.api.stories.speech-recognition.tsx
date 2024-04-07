import { Ai } from "@cloudflare/ai";
import {
	json,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
	type ActionFunctionArgs,
} from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
	const uploadHandler = unstable_createMemoryUploadHandler({
		maxPartSize: 512_000,
	});

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	);

	const audio = formData.get("audio");
	if (!audio || !(audio instanceof File)) {
		throw new Response(null, {
			status: 400,
		});
	}

	const ai = new Ai(context.cloudflare.env.AI);
	const buffer = await audio.arrayBuffer();

	const { text } = await ai.run("@cf/openai/whisper", {
		audio: [...new Uint8Array(buffer)],
	});

	return json({
		text,
	});
}
