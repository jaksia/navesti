<script lang="ts">
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import { colors } from '$lib/consts/styles';

	let pocetPriecesti = $state(1);
	let priecestieAktivne = $state(false);

	let light = $state(0);

	setInterval(() => {
		light = (light + 1) % 2;
	}, 1000);
</script>

<svelte:head>
	<title>Vlakové návestidlá</title>
</svelte:head>

<DayNight class="flex grow items-end justify-around">
	<div class="aspect-1/5 h-2/5">
		<div class="relative flex h-full w-full flex-col items-center">
			<div class="absolute top-0 aspect-4/6 w-[200%] -translate-y-full">
				<div class="p-shape bottom- absolute size-full bg-stone-950">
					<div
						class={[
							'absolute top-1/2 left-1/4 aspect-square w-7/24 -translate-1/2 rounded-full',
							colors.yellow
						]}
					></div>
					<div
						class={[
							'absolute top-1/2 right-1/4 aspect-square w-7/24 -translate-y-1/2 translate-x-1/2 rounded-full',
							colors.yellow
						]}
					></div>
					<div
						class={[
							'absolute left-1/2 aspect-square w-7/24 -translate-x-1/2 translate-y-1/2 rounded-full',
							colors.blank
						]}
					></div>
					<div
						class="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/4 text-6xl font-black text-white"
					>
						{pocetPriecesti}
					</div>
				</div>
				<div
					class={[
						'light absolute left-1/2 aspect-square w-7/24 -translate-x-1/2 translate-y-1/2 rounded-full',
						priecestieAktivne && colors.white
					]}
				></div>
			</div>
			<div class="pole priecestnik relative -z-10 h-full w-1/4"></div>
		</div>
	</div>
	<div class="flex aspect-5/4 h-4/5 items-end">
		<div class="pole priecestie relative h-2/5 w-4">
			<div
				class="absolute top-0 left-1/2 flex aspect-square w-30 -translate-full -translate-x-1/2 flex-col bg-stone-950"
			>
				<div class="flex justify-stretch gap-2 p-2">
					<div class="aspect-square flex-1 rounded-full bg-stone-900"></div>
					<div class="aspect-square flex-1 rounded-full bg-stone-900"></div>
				</div>
				<div class="flex justify-stretch gap-2 p-2">
					<div class="flex flex-1 flex-col justify-center gap-1">
						{#each Array.from({ length: 4 }) as _}
							<hr class="border-t-2 border-stone-900" />
						{/each}
					</div>
					<div class="aspect-square flex-2 rounded-full bg-stone-900"></div>
					<div class="flex flex-1 flex-col justify-center gap-1">
						{#each Array.from({ length: 4 }) as _}
							<hr class="border-t-2 border-stone-900" />
						{/each}
					</div>
				</div>
				<div class="absolute inset-0 flex flex-col">
					<div class="flex justify-stretch gap-2 p-2">
						<div
							class={[
								'light aspect-square flex-1 rounded-full duration-1000',
								priecestieAktivne && light == 0 && colors.red
							]}
						></div>
						<div
							class={[
								'light aspect-square flex-1 rounded-full duration-1000',
								priecestieAktivne && light == 1 && colors.red
							]}
						></div>
					</div>
					<div class="flex justify-stretch gap-2 p-2">
						<div class="flex-1"></div>
						<div
							class={[
								'light aspect-square flex-2 rounded-full duration-1000',
								!priecestieAktivne && light == 1 && colors.white
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
	</div>
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />
	<label for="pocet-priecesti" class="floating-label">
		<span>Počet priecestí</span>
		<div class="flex">
			<input
				type="number"
				id="pocet-priecesti"
				min="1"
				max="99"
				bind:value={pocetPriecesti}
				class="input"
			/>
		</div>
	</label>
	<label for="priecestie" class="label">
		<input type="checkbox" id="priecestie" bind:checked={priecestieAktivne} class="checkbox" />
		Priecestie
	</label>
	<div class="mt-auto">
		<a href="/" class="mt-auto font-bold underline">Naspäť</a>
	</div>
</div>

<style lang="scss">
	.pole {
		&.priecestnik {
			background-image: linear-gradient(
				to bottom,
				#000 12.5%,
				#fff 12.5%,
				#fff 25%,
				#000 25%,
				#000 37.5%,
				#fff 37.5%,
				#fff 50%,
				#000 50%,
				#000 62.5%,
				#fff 62.5%,
				#fff 75%,
				#000 75%,
				#000 87.5%,
				#fff 87.5%,
				#fff 100%
			);
		}
		&.priecestie {
			background-image: linear-gradient(
				to bottom,
				#f00 16.5%,
				#fff 16.5%,
				#fff 33%,
				#f00 33%,
				#f00 48.5%,
				#fff 48.5%,
				#fff 65%,
				#f00 65%,
				#f00 82%,
				#fff 82%,
				#fff 100%
			);
		}
	}

	.p-shape {
		clip-path: polygon(33% 0, 66% 0, 100% 33%, 100% 100%, 0 100%, 0 33%);
	}

	.n-label {
		--label-border-size: 2px;
	}
</style>
