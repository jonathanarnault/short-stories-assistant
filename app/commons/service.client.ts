export async function summarize(content: string): Promise<string> {
	const formData = new FormData();
	formData.set("content", content);

	const response = await fetch("/api/stories/summarize", {
		method: "POST",
		body: formData,
	});

	const { summary } = (await response.json()) as { summary: string };

	return summary.trim();
}
