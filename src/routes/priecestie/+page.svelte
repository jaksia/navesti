<script lang="ts">
	import SvetelneBieleZavory from '$lib/components/priecestie/SvetelneBieleZavory.svelte';
	import SvetelneBiele from '$lib/components/priecestie/SvetelneBiele.svelte';
	import Svetelne from '$lib/components/priecestie/Svetelne.svelte';
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import Label from '$lib/components/navestidla/parts/Label.svelte';
	import { colors } from '$lib/consts/styles';

	const types = {
		'Závorové s bielym svetlom': SvetelneBieleZavory,
		'Svetelné s bielym svetlom': SvetelneBiele,
		'Svetelné bez bieleho svetla': Svetelne
	};

	let pocetPriecesti = $state(1);
	let trackCount = $state(1);
	let volume = $state(35);
	let active = $state(false);

	let secure = $state(false);
	let clear = $state(true);

	let type = $state(Object.keys(types)[0]) as keyof typeof types;

	let Priecestie = $derived(types[type]);
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
						class="darken yellow absolute top-1/2 left-1/4 aspect-square w-7/24 -translate-1/2 rounded-full"
					></div>
					<div
						class="darken yellow absolute top-1/2 right-1/4 aspect-square w-7/24 -translate-y-1/2 translate-x-1/2 rounded-full"
					></div>
					<div
						class={[
							'absolute left-1/2 aspect-square w-7/24 -translate-x-1/2 translate-y-1/2 rounded-full',
							colors.blank
						]}
					></div>
					<div
						class="darken text absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/4 text-6xl font-black"
					>
						{pocetPriecesti}
					</div>
				</div>
				<div
					class={[
						'light absolute left-1/2 aspect-square w-7/24 -translate-x-1/2 translate-y-1/2 rounded-full',
						secure && colors.white
					]}
				></div>
			</div>
			<div class="pole priecestnik relative -z-10 h-full w-1/4">
				<div class="absolute top-1/6 aspect-square w-[110%]">
					<Label labelStyleClass="priecestnik" label="X-237" />
				</div>
			</div>
		</div>
	</div>
	<div class="flex aspect-5/4 h-4/5">
		<Priecestie {active} {trackCount} {volume} bind:clear bind:secure />
	</div>
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />
	<label for="type" class="floating-label">
		<span>Typ</span>
		<div class="flex">
			<select id="type" bind:value={type} class="select" disabled={active || !clear}>
				{#each Object.keys(types) as key}
					<option value={key}>{key}</option>
				{/each}
			</select>
		</div>
	</label>
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
				disabled={active || !clear}
			/>
		</div>
	</label>
	<label for="track-count" class="floating-label">
		<span>Počet koľají</span>
		<div class="flex">
			<input
				type="number"
				id="track-count"
				min="1"
				max="5"
				bind:value={trackCount}
				disabled={active || !clear}
				class="input"
			/>
		</div>
	</label>
	<label for="priecestie" class="label">
		<input type="checkbox" id="priecestie" bind:checked={active} class="checkbox" />
		Priecestie
		<input type="checkbox" id="secure" bind:checked={secure} class="checkbox ml-auto" disabled />
	</label>
	<fieldset class="fieldset border-base-300 rounded-box bg-base-200 border p-2">
		<legend class="label">Hlasitosť</legend>
		<input
			type="range"
			id="volume"
			min="0"
			max="100"
			step="1"
			bind:value={volume}
			class="range range-neutral"
		/>
	</fieldset>
	<div class="mt-auto">
		{#if active || !clear}
			<div class="my-3 text-xs text-red-500 italic">
				Priecestie je aktívne alebo sa vypína, nie je možné zmeniť nastavenia.
			</div>
		{/if}
		<a href="/" class="mt-auto font-bold underline">Naspäť</a>
	</div>
</div>

<style lang="scss">
	.pole.priecestnik {
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
	:global(.pole.priecestie) {
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

	.p-shape {
		clip-path: polygon(33% 0, 66% 0, 100% 33%, 100% 100%, 0 100%, 0 33%);
	}

	.yellow {
		background-color: var(--color-yellow-400);
	}

	.text {
		color: var(--color-white);
	}

	:global(.night) .darken {
		&.yellow {
			background-color: color-mix(in oklab, var(--color-yellow-400) 70%, #000);
		}

		&.text {
			color: color-mix(in oklab, var(--color-white) 70%, #000);
		}
	}
</style>
