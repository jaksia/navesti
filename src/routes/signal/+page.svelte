<script lang="ts">
	import AutoblokNavestidlo from '$lib/components/navestidla/AutoblokNavestidlo.svelte';
	import HlavneNavestidlo from '$lib/components/navestidla/HlavneNavestidlo.svelte';
	import Predzvest from '$lib/components/navestidla/Predzvest.svelte';
	import VlozeneNavestidlo from '$lib/components/navestidla/VlozeneNavestidlo.svelte';
	import ZriadovacieNavestidlo from '$lib/components/navestidla/ZriadovacieNavestidlo.svelte';
	import type { Additional, AllowedSignals, Navest, Rychlost } from '$lib/types/navestidlo';
	import DayNight from '$lib/components/DayNight.svelte';
	import Frame from '$lib/components/Frame.svelte';
	import type { DisplayMode } from '$lib/components/navestidla/Navestidlo.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import {
		TypNavestidla,
		typeOptions,
		isSpeed,
		isPredzvest,
		nazvyNavesti,
		povoleneOpakovanie,
		povolenaPrivolavacia,
		additionalNames
	} from '$lib/consts/navestidlo';

	let lightSelector = $state(false);

	let typ = $state(TypNavestidla.HLAVNE) as TypNavestidla;
	let rychlost: Rychlost | null = $state(null);

	let privolavacia = $state(false);
	let opakovanie = $state(false);
	let poslednyAutoblok = $state(false);
	let predzvestKryjeVyhybky = $state(false);

	let navest: Navest | null = $state(null);
	let additional: Additional | null = $state(null);

	const options = $derived(typeOptions[typ]);

	const safetySignal = $derived.by(() => {
		if (navest === null) return 0;
		if (navest == 'stoj' || navest == 'p_dovoleny') return 2;

		if (options.repeating && opakovanie) {
			if (navest == 'vystraha') return 2;
			if (isSpeed(navest)) return 4;
			if (navest == 'volno') return 3;
		}

		if (rychlost != null) return 4;

		if (isSpeed(navest) || navest == 'vystraha') return 1;
		if (navest == 'volno') return 3;

		return 0;
	});

	const speedEnabled = $derived(options.speedIndication && navest && isPredzvest(navest));

	$effect(() => {
		if (navest && !options.allowedSignals.includes(navest)) navest = null;
		if (typ == TypNavestidla.AUTOBLOK && !poslednyAutoblok && navest && isSpeed(navest))
			navest = 'volno';
	});

	let lastInteract = $state(0),
		now = $state(Date.now());
	setInterval(() => (now = Date.now()), 0);
</script>

<svelte:head>
	<title>Vlakové návestidlá</title>
</svelte:head>
<svelte:window onclick={() => (lastInteract = now)} onkeypress={() => (lastInteract = now)} />

{#snippet navestidlo(displayMode?: DisplayMode)}
	{#if typ === TypNavestidla.HLAVNE}
		<HlavneNavestidlo
			navest={navest as AllowedSignals[TypNavestidla.HLAVNE] | null}
			{privolavacia}
			{opakovanie}
			{rychlost}
			{additional}
			{displayMode}
		/>
	{:else if typ === TypNavestidla.HLAVNE_IBA_JAZDA}
		<HlavneNavestidlo
			iba_jazda={true}
			navest={navest as AllowedSignals[TypNavestidla.HLAVNE_IBA_JAZDA] | null}
			{privolavacia}
			{opakovanie}
			{rychlost}
			{additional}
			{displayMode}
		/>
	{:else if typ === TypNavestidla.AUTOBLOK}
		<AutoblokNavestidlo
			navest={navest as AllowedSignals[TypNavestidla.AUTOBLOK] | null}
			posledne={poslednyAutoblok}
			{displayMode}
		/>
	{:else if typ === TypNavestidla.PREDZVEST}
		<Predzvest
			navest={navest as AllowedSignals[TypNavestidla.PREDZVEST] | null}
			kryjeVyhybky={predzvestKryjeVyhybky}
			repeating={opakovanie}
			{additional}
			{displayMode}
		/>
	{:else if typ === TypNavestidla.ZRIADOVACIE}
		<ZriadovacieNavestidlo
			navest={navest as AllowedSignals[TypNavestidla.ZRIADOVACIE] | null}
			{displayMode}
		/>
	{:else if typ === TypNavestidla.VLOZENE}
		<VlozeneNavestidlo
			navest={navest as AllowedSignals[TypNavestidla.VLOZENE] | null}
			{displayMode}
		/>
	{/if}
{/snippet}

<DayNight class="flex grow items-end justify-center">
	{#if [TypNavestidla.HLAVNE, TypNavestidla.HLAVNE_IBA_JAZDA, TypNavestidla.AUTOBLOK].includes(typ)}
		<div class="absolute top-4 left-4 flex items-center">
			<h3
				class="mr-0.5 text-lg font-bold text-stone-800 [writing-mode:sideways-lr] dark:text-stone-600"
			>
				Pred návestidlom
			</h3>
			<div
				class="flex flex-col items-center gap-1 rounded-lg bg-stone-800 p-4 *:transition-colors *:duration-100"
			>
				<div
					class={['size-6 rounded-full', safetySignal == 1 ? 'bg-yellow-400' : 'bg-stone-900']}
				></div>
				<div
					class={['size-6 rounded-full', safetySignal == 2 ? 'bg-red-600' : 'bg-stone-900']}
				></div>
				<div
					class={['size-6 rounded-full', safetySignal == 3 ? 'bg-green-600' : 'bg-stone-900']}
				></div>
				<div
					class={[
						'size-6 rounded-full p-[20%]',
						safetySignal == 4 ? 'bg-yellow-400' : 'bg-stone-900'
					]}
				>
					<div class="size-full rounded-full bg-stone-900"></div>
				</div>
				<div
					class={[
						'mt-3 size-6 cursor-pointer rounded-full',
						now - lastInteract <= 2500 ? 'bg-sky-500' : 'bg-stone-900'
					]}
				></div>
			</div>
		</div>
	{/if}
	<div class="aspect-1/5 h-2/5">
		{@render navestidlo('stlp')}
	</div>
	<!-- <div class="flex h-full grow p-12 pb-0">
		<Frame>
			{@render navestidlo('lavka')}
			<div class="w-16">
				{@render navestidlo('lavka')}
			</div>
			<div class="w-16">
				{@render navestidlo('lavka')}
			</div>
		</Frame>
	</div> -->
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />
	{#if lightSelector}
		<div class="light-selector my-auto flex flex-col text-center">
			<a href="/light/red" class="rounded-t-lg bg-red-500 py-6 text-xl hover:bg-red-600">Červená</a>
			<a href="/light/green" class="bg-green-500 py-6 text-xl hover:bg-green-600">Zelená</a>
			<a href="/light/blue" class="bg-blue-700 py-6 text-xl hover:bg-blue-800">Modrá</a>
			<a href="/light/white" class="bg-white py-6 text-xl hover:bg-gray-200">Biela</a>
			<a href="/light/yellow" class="bg-yellow-400 py-6 text-xl hover:bg-yellow-500">Žltá</a>
			<a
				href="/light/approach"
				class="rounded-b-lg bg-linear-to-tr from-yellow-400 to-green-500 py-6 text-xl hover:from-yellow-500 hover:to-green-600"
				>Privolávacia</a
			>
		</div>

		<div class="mt-auto">
			<a
				href="/"
				class="block font-bold underline"
				onclick={(e) => (e.preventDefault(), (lightSelector = false))}
			>
				Zrušiť
			</a>
		</div>
	{:else}
		<div>
			<label for="typ" class="floating-label">
				<span>Typ návestidla</span>
				<select bind:value={typ} id="typ" name="typ" class="select">
					{#each Object.values(TypNavestidla) as typNavestidla}
						<option value={typNavestidla}>{typNavestidla}</option>
					{/each}
				</select>
			</label>
		</div>
		<div>
			<label for="navest" class="floating-label">
				<span>Návesť</span>
				<select bind:value={navest} id="navest" name="navest" class="select">
					<option value={null}>---</option>
					{#each options.allowedSignals as navest}
						<option
							value={navest}
							disabled={typ == TypNavestidla.AUTOBLOK && !poslednyAutoblok && isSpeed(navest)}
							>{nazvyNavesti[navest]}</option
						>
					{/each}
				</select>
			</label>
		</div>
		{#if options.speedIndication}
			<div>
				<label for="rychlost" class="floating-label">
					<span>Rýchlosť </span>
					<select
						bind:value={rychlost}
						id="rychlost"
						name="rychlost"
						class="select"
						disabled={!speedEnabled}
					>
						{#each [null, 40, 60, 80, 100] as rychlostOption}
							<option value={rychlostOption}>{rychlostOption ?? '---'}</option>
						{/each}
					</select>
				</label>
			</div>
		{/if}

		<fieldset class="fieldset border-base-300 rounded-box bg-base-200 border p-2">
			<legend class="fieldset-legend">Možnosti návestidla</legend>

			{#if options.privolavanie}
				<label for="privolavacia" class="fieldset-label">
					<input
						bind:checked={privolavacia}
						disabled={!povolenaPrivolavacia.includes(navest)}
						id="privolavacia"
						name="privolavacia"
						type="checkbox"
						class="checkbox"
					/>
					Privolávacia návesť
				</label>
			{/if}
			{#if options.repeating}
				<label for="opakovanie" class="fieldset-label">
					<input
						bind:checked={opakovanie}
						disabled={!povoleneOpakovanie.includes(navest) && typ != TypNavestidla.PREDZVEST}
						id="opakovanie"
						name="opakovanie"
						type="checkbox"
						class="checkbox"
					/>
					Opakovanie
				</label>
			{/if}
			{#if typ == TypNavestidla.AUTOBLOK}
				<label for="poslednyAutoblok" class="fieldset-label">
					<input
						bind:checked={poslednyAutoblok}
						id="poslednyAutoblok"
						name="poslednyAutoblok"
						type="checkbox"
						class="checkbox"
					/>
					Posledné návestidlo automatického bloku
				</label>
			{/if}
			{#if typ == TypNavestidla.PREDZVEST}
				<label for="predzvestKryjeVyhybky" class="fieldset-label">
					<input
						bind:checked={predzvestKryjeVyhybky}
						id="predzvestKryjeVyhybky"
						name="predzvestKryjeVyhybky"
						type="checkbox"
						class="checkbox"
					/>
					Hl. návestidlo kryje výhybky
				</label>
			{/if}
		</fieldset>

		{#if options.allowedAdditional.length > 0}
			<div>
				<label for="additional" class="floating-label">
					<span>Doplňujúce značky</span>
					<select bind:value={additional} id="additional" name="additional" class="select">
						<option value={null}>---</option>
						{#each options.allowedAdditional as additional}
							<option value={additional}>{additionalNames[additional]}</option>
						{/each}
					</select>
				</label>
			</div>
		{/if}

		<div class="mt-auto">
			<a href="/signal/custom" class="block font-bold underline">Vlastné návestidlo</a>
			<a
				href="/light"
				class="block font-bold underline"
				onclick={(e) => (e.preventDefault(), (lightSelector = true))}>Svetlo</a
			>
			<a href="/" class="mt-auto font-bold underline">Naspäť</a>
		</div>
	{/if}
	<i class="mt-4 text-sm">
		Presný počet a poradie svetiel sa môže líšiť. Na vyskúšanie ľubovoľnej kombinácie svetiel a
		značiek využite <a href="/signal/custom" class="underline">vlastné návestidlo</a>.
	</i>
</div>

<style>
	.light-selector > * {
		color: black;
		font-weight: bold;
	}

	.fieldset:not(:has(label)) {
		display: none;
	}
</style>
