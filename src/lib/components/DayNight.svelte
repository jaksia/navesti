<script lang="ts">
	import store from '$lib/store.svelte';
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	const {
		children,
		class: classProp = '',
		style: styleProp = '',
		duration = 750
	}: {
		children: Snippet;
		class?: string;
		style?: string;
		duration?: number;
	} = $props();
</script>

<main
	class="relative h-full w-full grow overflow-hidden"
	style="{styleProp}; --anim-duration: {prefersReducedMotion.current ? 0 : duration}ms;"
>
	<div class="day absolute inset-0 z-0 {classProp}">
		<div class="day-bg absolute inset-0 -z-20"></div>
		{@render children()}
	</div>

	<div class="night absolute inset-0 z-0 {classProp} {store.day ? '' : 'show'}">
		<div
			class="night-bg absolute inset-0 -z-20 bg-radial-[at_95%_5%] from-gray-600 to-gray-800 to-20%"
		></div>
		<div
			class="moon absolute top-[5%] left-[95%] -z-10 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 drop-shadow-2xl"
		></div>
		{@render children()}
	</div>
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

		transform: scale(var(--moon-scale));
	}

	.day-bg {
		background-image: linear-gradient(
			to top,
			var(--color-lime-300) var(--ground),
			var(--color-cyan-200) calc((var(--ground) + 100%) / 2),
			var(--color-cyan-300) 100%
		);
	}

	.day-bg,
	.night-bg {
		pointer-events: none;
	}

	:global(.light) {
		transition: all 300ms;
	}

	:global .night {
		.light {
			--shadow-size: 30px;
			--shadow-color: var(--base-color);

			&.bg-stone-800 {
				z-index: -1;
			}

			&.letter {
				--shadow-size: 20px;
				--third-shadow-color: color-mix(in oklab, var(--shadow-color) 50%, transparent);

				&.text-white {
					--base-color: var(--color-white);
				}
			}

			&.stripe {
				--shadow-size: 20px;
				--shadow-color: color-mix(in oklab, var(--base-color) 60%, transparent);
			}

			filter: drop-shadow(0 0 calc(var(--shadow-size) * 1.5) var(--shadow-color))
				drop-shadow(0 0 var(--shadow-size) var(--shadow-color))
				drop-shadow(0 0 var(--shadow-size) var(--third-shadow-color, transparent))
				var(--additional-filter,);

			&.bg-yellow-400 {
				--base-color: color-mix(in oklab, var(--color-yellow-400) 75%, transparent);
				--third-shadow-color: color-mix(in oklab, var(--shadow-color) 50%, transparent);
			}
			&.bg-green-600 {
				--base-color: var(--color-green-600);
				--third-shadow-color: color-mix(in oklab, var(--shadow-color) 60%, transparent);
			}
			&.bg-red-600 {
				--base-color: var(--color-red-600);
				--third-shadow-color: var(--shadow-color);
			}
			&.bg-blue-500 {
				--shadow-color: var(--color-blue-500);
				--third-shadow-color: var(--shadow-color);
			}
			&.bg-white {
				--shadow-color: color-mix(in oklab, var(--color-white) 90%, transparent);
			}
		}

		.arm::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			border-radius: inherit;

			background-color: #0008;
		}

		:is(.pole, .label)::before {
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

			background-color: #0008;
			outline-color: #0008;
		}

		.pole .sign::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			background-color: #0008;
		}
	}
</style>
