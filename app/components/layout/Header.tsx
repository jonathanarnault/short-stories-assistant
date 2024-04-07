import { Link } from "@remix-run/react";

import "./Header.css";

export function Header() {
	return (
		<header>
			<div className="flex-none">
				<button className="btn btn-square btn-ghost" type="button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="inline-block w-5 h-5 stroke-current"
					>
						<title>My Stories</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>

			<div className="flex-1">
				<Link className="text-xl" to="/">
					Short Stories Assistant
				</Link>
			</div>
		</header>
	);
}
