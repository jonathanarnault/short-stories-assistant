import { Link } from "@remix-run/react";
import type { Story } from "~/commons/types";

import "./Header.css";

type HeaderProps = {
	stories: Story[];
};

export function Header({ stories }: HeaderProps) {
	return (
		<>
			<div className="drawer">
				<input id="menu-drawer" type="checkbox" className="drawer-toggle" />

				<div className="drawer-side">
					<label
						htmlFor="menu-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
					/>

					<ul className="menu p-4 w-80 min-h-full bg-white gap-2">
						{stories.map((story) => (
							<li>
								<Link to={`/stories/${story.id}/view`}>
									{story.title ?? `Story #${story.id}`}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			<header>
				<div className="flex-none">
					<label
						htmlFor="menu-drawer"
						aria-label="open sidebar"
						className="btn btn-square btn-ghost"
					>
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
					</label>
				</div>
				<div className="flex-1">
					<Link className="text-xl" to="/">
						Short Stories Assistant
					</Link>
				</div>
			</header>
		</>
	);
}
