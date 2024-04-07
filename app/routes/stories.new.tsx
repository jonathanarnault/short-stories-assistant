import type { ActionFunctionArgs, MetaDescriptor } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export function meta(): MetaDescriptor[] {
	return [{ title: "Create a Story" }];
}

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData();
	const prompt = form.get("prompt");

	if (!prompt || typeof prompt !== "string") {
		return redirect("/");
	}

	return json({
		prompt,
	});
}

export default function StoriesNew() {
	const navigate = useNavigate();
	const actionData = useActionData<typeof action>();
	const responseRef = useRef<HTMLTextAreaElement | null>(null);

	const [source, setSource] = useState<EventSource | null>(null);
	const [isLoading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		// Redirect to home if no prompt has been given
		if (!actionData?.prompt) {
			setTimeout(() => navigate("/"), 0);
			return;
		}

		setSource(
			new EventSource(`/stream/stories/new?prompt=${actionData.prompt}`),
		);
	}, [actionData?.prompt, navigate]);

	useEffect(() => {
		if (!source) {
			return;
		}

		let text = "";
		source.onmessage = (message) => {
			try {
				if (message.data === "[DONE]") {
					setLoading(false);
					source.close();
					return;
				}

				const { response } = JSON.parse(message.data) as { response: string };
				text += response;
				if (!responseRef.current) {
					return;
				}

				responseRef.current.value = text.trim();
			} catch (e) {
				console.warn("Failed to decode message", e);
			}
		};

		return () => {
			if (source.readyState === source.CLOSED) {
				return;
			}

			source.close();
		};
	}, [source]);

	return (
		<Form
			className="flex flex-grow flex-col gap-2"
			action="/stories/create"
			method="POST"
		>
			<textarea
				ref={responseRef}
				name="content"
				className="textarea textarea-primary resize-none flex-grow"
				disabled={isLoading}
			/>

			<div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-4">
				<button
					type="submit"
					className="btn btn-primary lg:col-start-4 lg:col-end-4"
					disabled={isLoading}
				>
					{isLoading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						"Save"
					)}
				</button>
			</div>
		</Form>
	);
}
