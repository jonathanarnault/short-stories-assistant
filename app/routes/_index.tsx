import type { MetaDescriptor } from "@remix-run/cloudflare";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { action as speechRecognitionAction } from "~/routes/_api.api.stories.speech-recognition";

export function meta(): MetaDescriptor[] {
	return [
		{ title: "Short Stories Assistant" },
		{
			name: "description",
			content: "An AI-based assistant that helps you write short stories.",
		},
	];
}

export default function Index() {
	const promptInputRef = useRef<HTMLTextAreaElement | null>(null);
	const audioFormRef = useRef<HTMLFormElement | null>(null);
	const audioInputRef = useRef<HTMLInputElement | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const fetcher = useFetcher<typeof speechRecognitionAction>();

	useEffect(() => {
		if (fetcher.state !== "idle" || !fetcher.data) {
			return;
		}

		setIsLoading(false);

		if (!promptInputRef.current) {
			return;
		}

		promptInputRef.current.value = fetcher.data.text ?? "";
	}, [fetcher.state, fetcher.data]);

	const handleLoadAudio = () => {
		if (!audioInputRef.current) {
			return;
		}

		audioInputRef.current.click();
	};

	const handleAudioSelected = () => {
		if (!audioFormRef.current) {
			return;
		}

		setIsLoading(true);

		fetcher.submit(audioFormRef.current);
	};

	return (
		<>
			<Form
				className="flex flex-grow flex-col gap-2"
				action="/stories/new"
				method="POST"
			>
				<label htmlFor="model">Model used for story generation</label>

				<select name="model" className="select select-primary" id="model">
					<option value="mistral-7b">Mistral 7B</option>
					<option value="llama2-7b">LLAMA 2 7B</option>
					<option value="llama2-13b">LLAMA 2 13B</option>
				</select>

				<label htmlFor="prompt">Prompt for a story</label>

				<textarea
					id="prompt"
					name="prompt"
					className="textarea textarea-primary resize-none flex-grow"
					ref={promptInputRef}
				/>

				<div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-4">
					<button
						type="submit"
						className="btn btn-primary lg:col-start-4 lg:col-end-4"
						disabled={isLoading}
					>
						Generate a story
					</button>

					<button
						type="button"
						className="btn btn-ghost lg:col-start-3 lg:col-end-3 lg:row-start-1"
						disabled={isLoading}
						onClick={handleLoadAudio}
					>
						{isLoading ? (
							<span className="loading loading-spinner loading-sm" />
						) : (
							"Import story prompt from MP3 file"
						)}
					</button>
				</div>
			</Form>

			<Form
				encType="multipart/form-data"
				ref={audioFormRef}
				action="/api/stories/speech-recognition"
				method="POST"
			>
				<input
					name="audio"
					type="file"
					className="hidden"
					accept=".mp3"
					ref={audioInputRef}
					onChange={handleAudioSelected}
				/>
			</Form>
		</>
	);
}
