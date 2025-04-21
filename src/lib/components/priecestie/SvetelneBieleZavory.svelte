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
			class="absolute top-0 left-1/2 flex aspect-square w-30 -translate-x-1/2 -translate-y-full flex-col bg-stone-950"
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
<div class="flex size-full items-end justify-between">
	<div class="flex h-full items-end">
		{@render priecestieSvetlo()}
		<div class="gate-wrapper z-10 scale-90 pl-8">
			<div class={['gate', closed && 'closed']}>
				<div class="front"></div>
				<div class="front-inside"></div>
				<div class="back"></div>
				<div class="back-inside"></div>
				<div class="left"></div>
				<div class="left-inside"></div>
				<div class="bottom">
					<div class="front-cover"></div>
					<div class="back-cover"></div>
				</div>
				<div class="top">
					<div class="front-cover"></div>
					<div class="back-cover"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex h-full items-end">
		<div class="gate-wrapper z-10 scale-90 pr-8">
			<div class={['gate flipped', closed && 'closed']}>
				<div class="front"></div>
				<div class="front-inside"></div>
				<div class="back"></div>
				<div class="back-inside"></div>
				<div class="left"></div>
				<div class="left-inside"></div>
				<div class="bottom">
					<div class="front-cover"></div>
					<div class="back-cover"></div>
				</div>
				<div class="top">
					<div class="front-cover"></div>
					<div class="back-cover"></div>
				</div>
			</div>
		</div>
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
		margin-bottom: 100px;
		perspective: 500px;
	}

	.gate {
		--base-transform: ;
		transform-style: preserve-3d;
		transform: var(--base-transform) rotateZ(-90deg);
		transform-origin: left center;
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

			color: black;

			display: flex;
			justify-content: center;
			align-items: center;

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
			width: 500px;
			height: 20px;
			background: url('/elements/priecestie/rameno/arm-inside.svg') no-repeat left;
		}

		.left {
			width: 100px;
			height: 20px;
			background: url('/elements/priecestie/rameno/side-outside.svg') no-repeat center;

			transform: rotateY(-90deg) translateZ(50px);
		}

		.left-inside {
			width: 100px;
			height: 20px;
			background: url('/elements/priecestie/rameno/side-inside.svg') no-repeat center;

			transform: rotateY(-90deg) translateZ(45px);
		}

		.front {
			transform: translateZ(25px) rotateY(var(--front-back-angle));
		}

		.back {
			transform: translateZ(-25px) rotateY(calc(var(--front-back-angle) * -1));
		}

		.front-inside {
			transform: translateZ(20px) rotateY(var(--front-back-angle));
		}

		.back-inside {
			transform: translateZ(-20px) rotateY(calc(var(--front-back-angle) * -1));
		}

		.bottom {
			width: 500px;
			height: 100px;
			transform: rotateX(90deg) translateZ(30px);
			background: #fffa;
		}

		.top {
			width: 500px;
			height: 100px;
			transform: rotateX(90deg) translateZ(50px);
			background: #ff0a;
		}
	}
</style>
