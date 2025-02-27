<script lang="ts">
	import store from '$lib/store.svelte';
	import type { Snippet } from 'svelte';
	import { scale, type TransitionConfig } from 'svelte/transition';

	const {
		children,
		class: classProp = '',
		style: styleProp = ''
	}: {
		children: Snippet;
		class?: string;
		style?: string;
	} = $props();

	function radialMask(
		node: Element,
		{ origin = 'center', delay = 0, duration = 400 }
	): TransitionConfig {
		return {
			delay,
			duration,
			css: (t, u) => {
				const r = 100 * t;
				return `mask-image: radial-gradient(circle at ${origin}, black ${r}%, transparent ${r}%)`;
			}
		};
	}
</script>

<div class="relative {classProp} z-0 {store.day ? 'day' : 'night'}" style={styleProp}>
	<div class="day-bg absolute inset-0 -z-20"></div>
	{#if !store.day}
		<div
			transition:radialMask={{ origin: '95% 5%', duration: 500 }}
			class="night-bg absolute inset-0 -z-10 bg-radial-[at_95%_5%] from-gray-600 to-gray-800 to-20%"
		></div>
		<div
			transition:scale={{ duration: 500 }}
			class="absolute top-[5%] left-[95%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 drop-shadow-2xl"
		></div>
	{/if}
	{@render children()}
</div>

<style lang="scss">
	.day-bg {
		background-image: linear-gradient(
			to top,
			var(--color-lime-300) var(--ground, 0%),
			var(--color-cyan-200) calc((var(--ground, 0%) + 100%) / 2),
			var(--color-cyan-300) 100%
		);
	}

	.day-bg,
	.night-bg {
		pointer-events: none;
	}

	:global .night .light {
		transition-property: all;
		filter: drop-shadow(0 0 45px var(--shadow-color)) drop-shadow(0 0 30px var(--shadow-color))
			drop-shadow(0 0 30px var(--third-shadow-color, transparent));

		&.bg-yellow-400 {
			--shadow-color: color-mix(in oklab, var(--color-yellow-400) 75%, transparent);
			--third-shadow-color: color-mix(in oklab, var(--shadow-color) 50%, transparent);
		}
		&.bg-green-600 {
			--shadow-color: var(--color-green-600);
			--third-shadow-color: color-mix(in oklab, var(--shadow-color) 60%, transparent);
		}
		&.bg-red-600 {
			--shadow-color: var(--color-red-600);
			--third-shadow: drop-shadow(
				0 0 30px color-mix(in oklab, var(--shadow-color) 50%, transparent)
			);
		}
		&.bg-blue-500 {
			--shadow-color: var(--color-blue-500);
			--third-shadow-color: var(--shadow-color);
		}
		&.bg-white {
			--shadow-color: color-mix(in oklab, var(--color-white) 90%, transparent);
		}
	}

	:global(.pole)::before,
	:global(.label)::before {
		content: '';
		position: absolute;
		top: calc(var(--label-border-size, 0) * -1);
		left: calc(var(--label-border-size, 0) * -1);
		min-width: 100%;
		min-height: 100%;
		width: calc(100% + var(--label-border-size, 0) * 2);
		height: calc(100% + var(--label-border-size, 0) * 2);

		border-radius: inherit;
		outline: inherit;

		transition-property: background-color, outline-color;
		transition-duration: 0.5s;
	}
	:global(.pole > * > *)::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		transition-property: background-color;
		transition-duration: 0.5s;
	}

	.night {
		:global(.pole)::before,
		:global(.label)::before {
			background-color: #00000080;
			outline-color: #00000080;
		}

		:global(.pole > * > *)::after {
			background-color: #00000080;
		}
	}
</style>
