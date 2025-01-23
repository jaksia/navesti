import containerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			animation: {
				'blink': 'blink 1s infinite',
				'blink-fast': 'blink 0.5s infinite'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: "0" },
					'50%': { opacity: "1" }
				}
			},
			fontSize: {
				'2xs': '0.625rem',
				'2.5xs': '0.5875rem',
				'3xs': '0.5rem'
			},
			padding: {
				'0.75': '0.1875rem',
				'0.25': '0.0625rem',
			}
		}
	},

	plugins: [containerQueries]
} satisfies Config;
