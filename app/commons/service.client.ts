export async function summarize(
	content: string,
	size: 24 | 512,
): Promise<string> {
	const formData = new FormData();
	formData.set("content", content);
	formData.set("size", size.toString(10));

	const response = await fetch("/api/stories/summarize", {
		method: "POST",
		body: formData,
	});

	const { summary } = (await response.json()) as { summary: string };

	return summary.trim();
}

export async function generateImage(summary: string): Promise<string> {
	const formData = new FormData();
	formData.set("summary", summary);

	const response = await fetch("/api/stories/image", {
		method: "POST",
		body: formData,
	});

	const blob = await response.blob();

	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			resolve(reader.result as string);
		};
	});
}
