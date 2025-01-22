import containerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			animation: {
				'blink': 'blink 1.5s infinite',
				'blink-fast': 'blink 0.7s infinite'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: "1" },
					'50%': { opacity: "0" }
				}
			},
		}
	},

	plugins: [containerQueries]
} satisfies Config;
