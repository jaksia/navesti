<script lang="ts">
	import store from '$lib/store.svelte';
	import AutoblokNavestidlo from '$lib/components/navestidla/AutoblokNavestidlo.svelte';
	import HlavneNavestidlo from '$lib/components/navestidla/HlavneNavestidlo.svelte';
	import Predzvest from '$lib/components/navestidla/Predzvest.svelte';
	import VlozeneNavestidlo from '$lib/components/navestidla/VlozeneNavestidlo.svelte';
	import ZriadovacieNavestidlo from '$lib/components/navestidla/ZriadovacieNavestidlo.svelte';
	import {
		TypNavestidla,
		additionalNames,
		isPredzvest,
		isSpeed,
		nazvyNavesti,
		povolenaPrivolavacia,
		povoleneOpakovanie,
		typeOptions,
		type Additional,
		type AllowedSignals,
		type Navest,
		type Rychlost
	} from '$lib/navestidlo';
	import Icon from '@iconify/svelte';
	import DayNight from '$lib/components/DayNight.svelte';

	let typ = $state(TypNavestidla.HLAVNE);
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
		if (opakovanie && navest == 'vystraha') return 2;
		if (opakovanie && isSpeed(navest)) return 4;
		if (isSpeed(navest) || navest == 'vystraha') return 1;
		if (navest == 'volno') return rychlost === null ? 3 : 4;
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

<svelte:window onclick={() => (lastInteract = now)} onkeypress={() => (lastInteract = now)} />

<DayNight class="flex grow items-end justify-center">
	{#if [TypNavestidla.HLAVNE, TypNavestidla.HLAVNE_IBA_JAZDA, TypNavestidla.AUTOBLOK].includes(typ)}
		<div class="absolute top-4 left-4 flex items-center">
			<h3
				class="mr-0.5 text-lg font-bold [writing-mode:sideways-lr] {store.day
					? 'text-stone-800 '
					: 'text-stone-600'}"
			>
				Pred návestidlom
			</h3>
			<div
				class="flex flex-col items-center gap-1 rounded-lg bg-stone-800 p-4 *:transition-colors *:duration-100"
			>
				<div
					class="h-6 w-6 rounded-full {safetySignal == 1 ? 'bg-yellow-400' : 'bg-stone-900'}"
				></div>
				<div class="h-6 w-6 rounded-full {safetySignal == 2 ? 'bg-red-600' : 'bg-stone-900'}"></div>
				<div
					class="h-6 w-6 rounded-full {safetySignal == 3 ? 'bg-green-600' : 'bg-stone-900'}"
				></div>
				<div
					class="relative h-6 w-6 rounded-full p-[5px] {safetySignal == 4
						? 'bg-yellow-400'
						: 'bg-stone-900'}"
				>
					<div class="h-3.5 w-3.5 transform rounded-full bg-stone-900"></div>
				</div>
				<div
					class="mt-3 h-6 w-6 cursor-pointer rounded-full {now - lastInteract <= 2500
						? 'bg-sky-500'
						: 'bg-stone-900'}"
				></div>
			</div>
		</div>
	{/if}
	<div class="aspect-1/5 h-2/5">
		{#if typ === TypNavestidla.HLAVNE}
			<HlavneNavestidlo
				navest={navest as AllowedSignals[TypNavestidla.HLAVNE] | null}
				{privolavacia}
				{opakovanie}
				{rychlost}
				{additional}
			/>
		{:else if typ === TypNavestidla.HLAVNE_IBA_JAZDA}
			<HlavneNavestidlo
				iba_jazda={true}
				navest={navest as AllowedSignals[TypNavestidla.HLAVNE_IBA_JAZDA] | null}
				{privolavacia}
				{opakovanie}
				{rychlost}
				{additional}
			/>
		{:else if typ === TypNavestidla.AUTOBLOK}
			<AutoblokNavestidlo
				navest={navest as AllowedSignals[TypNavestidla.AUTOBLOK] | null}
				posledne={poslednyAutoblok}
			/>
		{:else if typ === TypNavestidla.PREDZVEST}
			<Predzvest
				navest={navest as AllowedSignals[TypNavestidla.PREDZVEST] | null}
				kryjeVyhybky={predzvestKryjeVyhybky}
				repeating={opakovanie}
				{additional}
			/>
		{:else if typ === TypNavestidla.ZRIADOVACIE}
			<ZriadovacieNavestidlo navest={navest as AllowedSignals[TypNavestidla.ZRIADOVACIE] | null} />
		{:else if typ === TypNavestidla.VLOZENE}
			<VlozeneNavestidlo navest={navest as AllowedSignals[TypNavestidla.VLOZENE] | null} />
		{/if}
	</div>
</DayNight>
<div class="flex flex-col bg-gray-500 p-5">
	<button onclick={() => (store.day = !store.day)} class="ml-auto cursor-pointer rounded-md p-1">
		{#if store.day}
			<Icon icon="bi:moon-stars-fill" class="h-6 w-6" />
		{:else}
			<Icon icon="bi:sun-fill" class="h-6 w-6" />
		{/if}
	</button>
	<div>
		<label for="typ">Typ návestidla</label>
		<select
			bind:value={typ}
			id="typ"
			name="typ"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
		>
			{#each Object.values(TypNavestidla) as typNavestidla}
				<option value={typNavestidla}>{typNavestidla}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="navest">Návesť</label>
		<select
			bind:value={navest}
			id="navest"
			name="navest"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
		>
			<option value={null}>---</option>
			{#each options.allowedSignals as navest}
				<option
					value={navest}
					disabled={typ == TypNavestidla.AUTOBLOK && !poslednyAutoblok && isSpeed(navest)}
					>{nazvyNavesti[navest]}</option
				>
			{/each}
		</select>
	</div>
	{#if options.speedIndication}
		<div>
			<label for="rychlost">Rýchlosť</label>
			<select
				bind:value={rychlost}
				id="rychlost"
				name="rychlost"
				class="mt-1 block w-full rounded-l bg-gray-100 p-1 disabled:bg-gray-400"
				disabled={!speedEnabled}
			>
				{#each [null, 40, 60, 80, 100] as rychlostOption}
					<option value={rychlostOption}>{rychlostOption ?? '---'}</option>
				{/each}
			</select>
		</div>
	{/if}
	{#if options.privolavanie}
		<div>
			<label for="privolavacia">Privolávacia návesť</label>
			<input
				bind:checked={privolavacia}
				disabled={!povolenaPrivolavacia.includes(navest)}
				id="privolavacia"
				name="privolavacia"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
	{/if}
	{#if options.repeating}
		<div>
			<label for="opakovanie">Opakovanie</label>
			<input
				bind:checked={opakovanie}
				disabled={!povoleneOpakovanie.includes(navest) && typ != TypNavestidla.PREDZVEST}
				id="opakovanie"
				name="opakovanie"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
	{/if}
	{#if typ == TypNavestidla.AUTOBLOK}
		<div>
			<label for="poslednyAutoblok">Posledné návestidlo automatického bloku</label>
			<input
				bind:checked={poslednyAutoblok}
				id="poslednyAutoblok"
				name="poslednyAutoblok"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
	{/if}
	{#if typ == TypNavestidla.PREDZVEST}
		<div>
			<label for="predzvestKryjeVyhybky">Hl. návestidlo kryje výhybky</label>
			<input
				bind:checked={predzvestKryjeVyhybky}
				id="predzvestKryjeVyhybky"
				name="predzvestKryjeVyhybky"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
	{/if}
	{#if options.allowedAdditional.length > 0}
		<div>
			<label for="additional">Doplňujúce značky</label>
			<select
				bind:value={additional}
				id="additional"
				name="additional"
				class="mt-1 block w-full rounded-l bg-gray-100 p-1"
			>
				<option value={null}>---</option>
				{#each options.allowedAdditional as additional}
					<option value={additional}>{additionalNames[additional]}</option>
				{/each}
			</select>
		</div>
	{/if}
	<div class="mt-auto">
		<a href="/mechanicke" class="block font-bold underline">Mechanické návestidlá</a>
		<a href="/spadovisko" class="block font-bold underline">Spádovisko</a>
		<a href="/autoblok" class="block font-bold underline">Autoblok</a>
		<a href="/custom" class="block font-bold underline">Vlastné návestidlo</a>
		<a href="/svetlo" class="block font-bold underline">Svetlo</a>
	</div>
	<i class="mt-4 text-sm">
		Presný počet a poradie svetiel sa môže líšiť.<br />
		Napr. opakovacie hlavné návestidlá môžu mať <br />
		biele svetlo tam, kde býva štandardne červené.
	</i>
</div>
