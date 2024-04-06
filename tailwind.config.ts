import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./app/**/*.{ts,tsx}"],
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["fantasy"],
	},
};

export default config;
