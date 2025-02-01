<script lang="ts">
	import AutoblokNavestidlo from '$lib/components/AutoblokNavestidlo.svelte';
	import HlavneNavestidlo from '$lib/components/HlavneNavestidlo.svelte';
	import HlavneNavestidloJazda from '$lib/components/HlavneNavestidloJazda.svelte';
	import Predzvest from '$lib/components/Predzvest.svelte';
	import VlozeneNavestidlo from '$lib/components/VlozeneNavestidlo.svelte';
	import ZriadovacieNavestidlo from '$lib/components/ZriadovacieNavestidlo.svelte';
	import {
		TypNavestidla,
		isPredzvest,
		isSpeed,
		nazvyNavesti,
		povoleneNavesti,
		typeOptions,
		type Navest,
		type Rychlost
	} from '$lib/navestidlo';

	let typ = $state(TypNavestidla.HLAVNE);
	let rychlost: Rychlost | null = $state(null);

	let privolavacia = $state(false);
	let opakovanie = $state(false);
	let poslednyAutoblok = $state(false);
	let predzvestKryjeVyhybky = $state(false);

	let navest: Navest | null = $state(null);

	const options = $derived(typeOptions[typ]);

	let safetyClicked = $state(false);
	const safetySignal = $derived.by(() => {
		if (navest === null) return 0;
		if (navest == 'stoj') return 2;
		if (opakovanie && navest == 'vystraha') return 2;
		if (opakovanie && isSpeed(navest)) return 4;
		if (navest == 'vystraha') return 1;
		const l = ['volno', 40, 60, 80, 100];
		if (l.includes(navest)) return rychlost === null ? 3 : 4;
	});

	const speedEnabled = $derived(
		options.speedIndication && navest && (isPredzvest(navest) || navest == 'volno')
	);

	$effect(() => {
		if (navest && !povoleneNavesti[typ].includes(navest)) navest = null;
		if (typ == TypNavestidla.AUTOBLOK && !poslednyAutoblok && navest && isSpeed(navest))
			navest = 'volno';
	});
</script>

<div class="relative flex flex-grow flex-col items-center justify-end bg-green-200">
	{#if [TypNavestidla.HLAVNE, TypNavestidla.HLAVNE_IBA_JAZDA, TypNavestidla.AUTOBLOK].includes(typ)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute left-4 top-4 flex items-center">
			<h3 class="mr-0.5 text-lg font-bold text-stone-800 [writing-mode:sideways-lr]">
				Pred návestidlom
			</h3>
			<div
				class="flex flex-col items-center gap-1 rounded-lg bg-stone-800 p-4 *:transition-colors *:duration-100"
				onclick={() => (safetyClicked = !safetyClicked)}
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
					class="mt-3 h-6 w-6 rounded-full {safetyClicked ? 'bg-sky-500' : 'bg-stone-900'}"
				></div>
			</div>
		</div>
	{/if}
	<div class="aspect-[1/5] h-2/5">
		{#if typ === TypNavestidla.HLAVNE}
			<HlavneNavestidlo {navest} {privolavacia} {opakovanie} {rychlost} />
		{:else if typ === TypNavestidla.HLAVNE_IBA_JAZDA}
			<HlavneNavestidloJazda {navest} {privolavacia} {opakovanie} {rychlost} />
		{:else if typ === TypNavestidla.AUTOBLOK}
			<AutoblokNavestidlo {navest} posledne={poslednyAutoblok} />
		{:else if typ === TypNavestidla.PREDZVEST}
			<Predzvest {navest} kryjeVyhybky={predzvestKryjeVyhybky} repeating={opakovanie} />
		{:else if typ === TypNavestidla.ZRIADOVACIE}
			<ZriadovacieNavestidlo {navest} />
		{:else if typ === TypNavestidla.VLOZENE}
			<VlozeneNavestidlo {navest} />
		{/if}
	</div>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<div>
		<label for="typ">Typ návestidla</label>
		<select bind:value={typ} id="typ" name="typ" class="mt-1 block w-full">
			{#each Object.values(TypNavestidla) as typNavestidla}
				<option value={typNavestidla}>{typNavestidla}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="navest">Návesť</label>
		<select bind:value={navest} id="navest" name="navest" class="mt-1 block w-full">
			<option value={null}>---</option>
			{#each povoleneNavesti[typ] as navest}
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
				class="mt-1 block w-full"
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
	<div class="mt-auto">
		<a href="/mechanicke" class="block font-bold underline">Mechanické návestidlá</a>
		<a href="/spadovisko" class="block font-bold underline">Spádovisko</a>
		<a href="/autoblok" class="block font-bold underline">Autoblok</a>
	</div>
	<i class="mt-4 text-sm">
		Presný počet a poradie svetiel sa môže líšiť.<br />
		Napr. opakovacie hlavné návestidlá môžu mať <br />
		biele svetlo tam, kde býva štandardne červené.
	</i>
</div>
