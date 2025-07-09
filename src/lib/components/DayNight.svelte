<script lang="ts">
	import store from '$lib/store.svelte';
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	const {
		children,
		class: classProp = '',
		style: styleProp = '',
		id = undefined,
		duration = 750
	}: {
		children: Snippet;
		class?: string;
		style?: string;
		id?: string;
		duration?: number;
	} = $props();

	let showDay = $state(true);
	let showNight = $state(true);
	let dayCopy = $state(store.day);

	let timeout: number | null = null;

	$effect(() => {
		store.day; // Needed for reactivity to trigger

		showDay = true;
		showNight = true;
		setTimeout(() => {
			dayCopy = store.day;
		}, 0);

		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			showDay = store.day;
			showNight = !store.day;
		}, duration * 2);
	});
</script>

<main
	class="relative size-full grow overflow-hidden"
	{id}
	style="{styleProp}; --anim-duration: {prefersReducedMotion.current ? 0 : duration}ms;"
>
	{#if showDay}
		<div class={['day absolute inset-0 z-0', classProp]}>
			<div class="day-bg absolute inset-0"></div>
			{@render children()}
		</div>
	{/if}
	{#if showNight}
		<div class={['night absolute inset-0 z-0', classProp, !dayCopy && 'show']}>
			<div class="night-bg absolute inset-0"></div>
			<div class="moon bg-white/90 drop-shadow-2xl"></div>
			{@render children()}
		</div>
	{/if}
</main>

<style lang="scss">
	@property --mask-size {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 0%;
	}

	@property --moon-scale {
		syntax: '<number>';
		inherits: false;
		initial-value: 0;
	}

	@property --ground {
		syntax: '<percentage>';
		inherits: true;
		initial-value: 0%;
	}

	.night {
		transition: --mask-size var(--anim-duration) cubic-bezier(0.22, 0.61, 0.36, 1);
		mask-image: radial-gradient(
			circle at 95% 5%,
			black var(--mask-size),
			transparent var(--mask-size)
		);

		&.show {
			--mask-size: 100%;

			.moon {
				--moon-scale: 1;
				transition-delay: 0s;
				transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
			}
		}
	}

	.moon {
		transition: --moon-scale calc(var(--anim-duration) / 2);
		transition-delay: calc(var(--anim-duration) / 2);

		transform: translate(-50%, -50%) scale(var(--moon-scale));

		position: absolute;
		top: 5%;
		left: 95%;
		z-index: -10;
		width: 4rem;
		aspect-ratio: 1;
		border-radius: 4rem;
	}

	.day-bg {
		background-image: linear-gradient(
			to top,
			var(--color-lime-300) var(--ground),
			var(--color-cyan-200) calc((var(--ground) + 100%) / 2),
			var(--color-cyan-300) 100%
		);
	}

	.night-bg {
		background-image: radial-gradient(
			at 95% 5%,
			var(--color-gray-600) 0%,
			var(--color-gray-800) 20%
		);
	}

	.day-bg,
	.night-bg {
		pointer-events: none;
		z-index: -20;
	}
</style>
