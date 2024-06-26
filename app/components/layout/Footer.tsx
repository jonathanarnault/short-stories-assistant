import { Link } from "@remix-run/react";
import "./Footer.css";

export function Footer() {
	return (
		<footer>
			<small>&copy;&nbsp;2024&nbsp;- J.&nbsp;ARNAULT</small>
			<small>
				<Link to="/license">License</Link>
				&nbsp;-&nbsp;
				<a
					href="https://github.com/jonathanarnault/short-stories-assistant"
					target="_blank"
					rel="noopener noreferrer"
				>
					Source&nbsp;Code&nbsp;
				</a>
			</small>
		</footer>
	);
}
