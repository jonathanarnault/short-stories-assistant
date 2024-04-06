import { useEffect, useRef, useState, type FormEventHandler } from "react";

import "./Home.css";

export default function Home() {
	const [source, setSource] = useState<EventSource | null>(null);
	const responseRef = useRef<HTMLTextAreaElement | null>(null);

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		setSource(
			new EventSource(`/api/stories?prompt=${e.currentTarget.prompt.value}`),
		);

		if (!responseRef.current) {
			return;
		}

		responseRef.current.value = "";
	};

	useEffect(() => {
		if (!source) {
			return;
		}

		let text = "";
		source.onmessage = (message) => {
			try {
				if (message.data === "[DONE]") {
					console.log("done");
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
				console.warn;
			}
		};

		return () => {
			if (!source || source.readyState === source.CLOSED) {
				return;
			}

			console.log("closing source");
			source?.close();
		};
	}, [source]);

	return (
		<form className="flex flex-grow flex-col gap-2" onSubmit={handleSubmit}>
			<label htmlFor="promp">Prompt for a story</label>

			<textarea
				id="prompt"
				name="prompt"
				className="textarea textarea-primary resize-none"
				defaultValue="a love story between and angel and a demon"
				rows={8}
			/>

			<textarea
				ref={responseRef}
				name="response"
				className="textarea textarea-primary resize-none flex-grow"
				disabled
			/>

			<div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-4">
				<button
					type="submit"
					className="btn btn-primary lg:col-start-4 lg:col-end-4"
				>
					Generate a story
				</button>

				<button
					type="button"
					className="btn btn-ghost lg:col-start-3 lg:col-end-3 lg:row-start-1"
					disabled
				>
					Import audio
				</button>
			</div>
		</form>
	);
}
