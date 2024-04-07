import { Ai } from "@cloudflare/ai";
import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
	const ai = new Ai(context.cloudflare.env.AI);
	const form = await request.formData();

	const content = form.get("content");
	if (!content || typeof content !== "string") {
		throw new Response(null, {
			status: 400,
		});
	}

	const { summary } = await ai.run("@cf/facebook/bart-large-cnn", {
		input_text: content,
		max_length: 256,
	});

	return json({
		summary,
	});
}
