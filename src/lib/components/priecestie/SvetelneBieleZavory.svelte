<script lang="ts">
	// Svetelne - S bielym svetlo - Bez zavor

	import { colors } from '$lib/consts/styles';
	import type { PriecestieProps } from '$lib/types/other';
	import { onMount } from 'svelte';

	let {
		active,
		secure = $bindable(false),
		volume,
		trackCount,
		clear = $bindable(true),
		enableWhite = true
	}: PriecestieProps & { enableWhite?: boolean } = $props();

	let sound: HTMLAudioElement | null = null;

	onMount(() => {
		if (sound) {
			sound.pause();
			sound = null;
		}
		sound = new Audio('/sounds/priecestie1.wav');
		sound.loop = true;
		sound.volume = volume / 100;
		console.log('sound', sound);
		return () => {
			if (sound) sound.pause();
			sound = null;
		};
	});

	$effect(() => {
		if (sound) sound.volume = volume / 100;
	});

	let timer: number | null;

	$effect(() => {
		if (timer) clearTimeout(timer);
		clear = false;
		if (active) {
			white = secure = false;
			red = true;
			if (sound && sound.paused) {
				sound.currentTime = 0;
				sound.play();
			}
			timer = setTimeout(() => {
				closed = true;
				timer = setTimeout(() => {
					secure = true;
				}, 6000);
			}, 5000);
		} else {
			closed = secure = false;
			timer = setTimeout(() => {
				if (sound && !sound.paused) sound.pause();
				timer = setTimeout(() => {
					red = false;
					clear = true;
					timer = setTimeout(() => {
						white = true;
					}, 5000);
				}, 750);
			}, 6000);
		}
	});

	let light = $state(0);
	let white = $state(false);
	let red = $state(false);
	let closed = $state(false);

	setInterval(() => {
		light = (light + 1) % 4;
	}, 500);
</script>

{#snippet priecestieSvetlo()}
	<div class="pole priecestie relative h-2/5 w-4">
		<div
			class="absolute left-1/2 flex aspect-square w-30 -translate-x-1/2 -translate-y-full flex-col bg-stone-950"
		>
			<div
				class="sign absolute -top-1 -left-[5%] w-[110%] -translate-y-full rounded border-3 border-black bg-white px-1"
			>
				{#if trackCount == 1}
					<img src="/elements/priecestie/1-kolaj.svg" alt="znacka-1kolaj" />
				{:else}
					<img src="/elements/priecestie/viac-kolaji.svg" alt="znacka-viac-kolaji" />
				{/if}
			</div>
			<div class="contents">
				<div class="flex justify-stretch gap-2 p-2">
					<div class="aspect-square flex-1 rounded-full bg-stone-900"></div>
					<div class="aspect-square flex-1 rounded-full bg-stone-900"></div>
				</div>
				<div class="flex justify-stretch gap-2 p-2">
					<div class="flex flex-1 flex-col justify-center gap-1">
						{#each Array.from({ length: 4 }) as _}
							<div class="fin"></div>
						{/each}
					</div>
					<div
						class={['aspect-square flex-2 rounded-full', enableWhite ? 'bg-stone-900' : 'bg-black']}
					></div>
					<div class="flex flex-1 flex-col justify-center gap-1">
						{#each Array.from({ length: 4 }) as _}
							<div class="fin"></div>
						{/each}
					</div>
				</div>
			</div>
			<div class="absolute inset-0 flex flex-col">
				<div class="flex justify-stretch gap-2 p-2">
					<div
						class={[
							'light aspect-square flex-1 rounded-full duration-400',
							red && light % 2 == 0 && colors.red
						]}
					></div>
					<div
						class={[
							'light aspect-square flex-1 rounded-full duration-400',
							red && light % 2 == 1 && colors.red
						]}
					></div>
				</div>
				<div class="flex justify-stretch gap-2 p-2">
					<div class="flex-1"></div>
					<div
						class={[
							'light aspect-square flex-2 rounded-full duration-1000',
							enableWhite && white && light < 2 && colors.white
						]}
					></div>
					<div class="flex-1"></div>
				</div>
			</div>
			<div
				class="n-label absolute bottom-0 w-full translate-y-full rounded-sm border-2 border-red-500 bg-white text-center font-bold text-red-500"
			>
				POZOR VLAK
			</div>
		</div>
	</div>
{/snippet}
{#snippet gate()}
	<div class="relative mb-10">
		<div class="gate-wrapper absolute -z-10">
			<div class={['gate', closed && 'closed']}>
				<div class="back"></div>
				<div class="back-inside"></div>
				<div class="bottom">
					<div class="back-half"></div>
				</div>
				<div class="top">
					<div class="back-half"></div>
				</div>
			</div>
		</div>
		<div class="absolute size-28 -translate-1/3 rounded bg-gray-600"></div>
		<div
			class="trace-mask absolute -top-12 left-3.5 size-24 rounded-full border-8 border-gray-800"
		></div>
		<div class="gate-wrapper">
			<div class={['gate', closed && 'closed']}>
				<div class="front"></div>
				<div class="front-inside"></div>
				<div class="left"></div>
				<div class="left-inside"></div>
				<div class="bottom">
					<div class="front-half"></div>
				</div>
				<div class="top">
					<div class="front-half"></div>
				</div>
			</div>
		</div>
	</div>
{/snippet}
<div class="flex size-full items-end justify-between">
	<div class="flex h-full items-end">
		{@render priecestieSvetlo()}
		{@render gate()}
	</div>
	<div class="flex h-full items-end">
		{@render priecestieSvetlo()}
	</div>
</div>

<style lang="scss">
	.n-label {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
		--label-border-size: 2px;
	}

	.fin {
		margin-top: 2px;
		border-top: 1px solid var(--color-stone-900);
		box-shadow: 0 0.5px 1px 1px var(--color-stone-900);
	}

	.gate-wrapper {
		perspective: 500px;
	}

	.gate {
		--base-transform: ;
		transform-style: preserve-3d;
		transform: var(--base-transform) rotateZ(-90deg);
		transform-origin: 7.5% 50%;
		transition: transform 5s;

		&.closed {
			transform: var(--base-transform) rotateZ(0deg);
		}

		&.flipped {
			--base-transform: rotateY(180deg) translateX(-100%);
		}
	}

	.gate {
		position: relative;
		width: 500px;
		height: 20px;

		div {
			position: absolute;

			background-size: cover;
		}

		--front-back-angle: 5.739deg;

		.front,
		.back {
			width: 500px;
			height: 20px;
			background: url('/elements/priecestie/rameno/arm-outside.svg') no-repeat center;
		}

		.front-inside,
		.back-inside {
			width: 450px;
			height: 20px;
			background-color: white;
		}

		.left {
			width: 100px;
			height: 20px;
			background: white;

			transform: rotateY(-90deg) translateZ(50px);
		}

		.left-inside {
			width: 90px;
			height: 20px;
			background: white;

			transform: rotateY(-90deg) translateZ(40px);
		}

		.front {
			transform: translateZ(25px) rotateY(var(--front-back-angle));
		}

		.back {
			transform: translateZ(-25px) rotateY(calc(var(--front-back-angle) * -1));
		}

		.front-inside {
			transform: translateZ(22.5px) rotateY(var(--front-back-angle));
		}

		.back-inside {
			transform: translateZ(-22.5px) rotateY(calc(var(--front-back-angle) * -1));
		}

		.top,
		.bottom {
			position: relative;
			width: 500px;
			height: 100px;

			* {
				position: absolute;
				width: 500px;
				height: 50px;

				background: url('/elements/priecestie/rameno/bottom.svg') no-repeat;
				background-size: cover;
			}

			.back-half {
				background-position: 0 0;
			}

			.front-half {
				top: 50px;
				background-position: 0 100%;
			}
		}

		.bottom {
			transform: rotateX(90deg) translateZ(30px);
		}

		.top {
			transform: rotateX(90deg) translateZ(150px);
		}
	}

	.trace-mask {
		clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%, 0 50%);
	}
</style>
