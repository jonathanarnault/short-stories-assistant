import { Ai } from "@cloudflare/ai";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
	const ai = new Ai(context.cloudflare.env.AI);
	const form = await request.formData();

	const summary = form.get("summary");
	if (!summary || typeof summary !== "string") {
		throw new Response(null, {
			status: 400,
		});
	}

	const response = await ai.run("@cf/lykon/dreamshaper-8-lcm", {
		prompt: summary,
	});

	return new Response(response, {
		headers: {
			"Content-Type": "image/png",
		},
	});
}
