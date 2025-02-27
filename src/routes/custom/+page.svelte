<script lang="ts">
	import { dev } from '$app/environment';
	import { blinking, colors } from '$lib/consts';
	import {
		customColorClasses,
		CustomLightColor,
		Mode,
		maxLightCounts,
		generatePattern,
		type LightMode,
		availableSignals as availableSignalsF,
		canRepeat,
		canPrivolavacia,
		modeNames
	} from '$lib/custom';
	import Icon from '@iconify/svelte';
	import { untrack } from 'svelte';
	import Navestidlo from '$lib/components/navestidla/Navestidlo.svelte';
	import {
		additionalNames,
		nazvyNavesti,
		vsetkyNavesti,
		type Additional,
		type Navest
	} from '$lib/navestidlo';
	import DayNight from '$lib/components/DayNight.svelte';
	import store from '$lib/store.svelte';
	import SkratenaVzdialenost from '$lib/components/navestidla/znacky/SkratenaVzdialenost.svelte';
	import Skupina from '$lib/components/navestidla/znacky/Skupina.svelte';
	import PredzvestVyhybky from '$lib/components/navestidla/znacky/PredzvestVyhybky.svelte';
	import PredzvestBezVyhybiek from '$lib/components/navestidla/znacky/PredzvestBezVyhybiek.svelte';

	let mode: Mode = $state(Mode.BUILD);

	let lights: CustomLightColor[] = $state([]);
	let activeLights: LightMode[] = $state([]);
	let lightElements: HTMLElement[] = $state([]);

	let signal: Navest | null = $state(null);
	let availableSignals: Navest[] = $derived(availableSignalsF(lights));

	let repeating = $state(false);
	let repeatingAvailable = $derived(canRepeat(lights, signal));

	let privolavacia = $state(false);
	let privolavaciaAvailable = $derived(canPrivolavacia(lights, signal));

	let label = $state('');
	let labelStyleClass: string | null = $state(null);
	let poleStyleClass: string | null = $state(null);

	const availableSigns: (Additional | 'predzvest_k' | 'predzvest_nk')[] = [
		'skratena_vzd',
		'skupinove',
		'predzvest_k',
		'predzvest_nk'
	];
	const signNames = {
		...additionalNames,
		predzvest_k: 'Hl. návestidlo kryje výhybky',
		predzvest_nk: 'Hl. návestidlo nekryje výhybky'
	};
	let selectedSigns: (Additional | 'predzvest_k' | 'predzvest_nk')[] = $state([]);

	$effect(() => {
		const [oldLE] = untrack(() => [lightElements]);
		lightElements = oldLE.slice(0, lights.length);

		if (mode === Mode.BUILD) {
			activeLights = lights.map(() => true);
		} else if (mode === Mode.MANUAL) {
			// Do nothing
		} else if (mode === Mode.SIGNAL) {
			let pattern;
			if (signal) pattern = generatePattern(lights, signal);
			if (!signal || !pattern) {
				pattern = lights.map(() => false);
			}
			if (repeating && repeatingAvailable) {
				pattern[lights.indexOf(CustomLightColor.WHITE)] = true;
			}
			if (privolavacia && privolavaciaAvailable) {
				pattern[lights.indexOf(CustomLightColor.WHITE)] = blinking.slow as LightMode;
			}
			activeLights = pattern;
		}
	});

	const colorCount = $derived.by(() => {
		return lights.reduce(
			(acc, color) => {
				acc[color] = (acc[color] ?? 0) + 1;
				return acc;
			},
			{} as Record<CustomLightColor, number>
		);
	});

	let activeDropBox: number | null = $state(null);
	let trashActive = $state(false);

	function dragover(event: DragEvent) {
		event.preventDefault();
		activeDropBox = lightElements.findIndex((el, i) => {
			const rect = el.getBoundingClientRect();
			const thirdY =
				i == activeDropBox ? rect.top + (rect.height * 2) / 3 : rect.top + rect.height / 3;
			return event.clientY <= thirdY;
		});
		if (activeDropBox === -1) activeDropBox = lights.length;
	}

	function drop(event: DragEvent, i: number, insert: boolean) {
		event.preventDefault();
		event.stopPropagation();
		if (!event.dataTransfer || !event.dataTransfer.getData('light')) return;
		const data = event.dataTransfer.getData('light').split(';') ?? [];
		const color = data[0] as CustomLightColor,
			origPos = parseInt(data[1]);

		(activeDropBox = null), (trashActive = false);

		if (origPos !== -1) {
			lights = [...lights.slice(0, origPos), ...lights.slice(origPos + 1)];
			activeLights = [...activeLights.slice(0, origPos), ...activeLights.slice(origPos + 1)];
		}
		if (i === -1) return;
		if (insert) {
			lights = [...lights.slice(0, i), color, ...lights.slice(i)];
			activeLights = [...activeLights.slice(0, i), false, ...activeLights.slice(i)];
		} else {
			lights[i] = color;
		}
	}

	function dragend() {
		(activeDropBox = null), (trashActive = false);
	}

	function cycleLight(i: number) {
		const list = [false, true, blinking.slow, blinking.fast] as LightMode[];
		const index = list.indexOf(activeLights[i]);
		activeLights[i] = list[(index + 1) % list.length];
	}
</script>

<svelte:body
	ondragend={dragend}
	ondragstart={(event) => mode !== Mode.BUILD && event.preventDefault()}
	ondragover={(event) => event.preventDefault()}
	ondrop={(event) => event.preventDefault()}
/>

<DayNight class="flex grow flex-col items-center justify-between">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mt-10 flex gap-1">
		{#each Object.values(CustomLightColor) as color}
			<div
				class="size-14 rounded-full text-2xl {customColorClasses[color]} {colorCount[color] >=
					maxLightCounts[color] || mode !== Mode.BUILD
					? 'disabled'
					: ''}"
				draggable={colorCount[color] >= maxLightCounts[color] ? 'false' : 'true'}
				ondragstart={(e) => e.dataTransfer?.setData('light', `${color};-1`)}
			></div>
		{/each}

		<div
			ondragover={(e) => (e.preventDefault(), (trashActive = true), (activeDropBox = null))}
			ondragleave={(e) => (trashActive = false)}
			ondrop={(e) => drop(e, -1, true)}
			class="ml-2 {mode !== Mode.BUILD ? 'disabled' : ''} transition-colors duration-500 {store.day
				? 'text-stone-800'
				: 'text-stone-600'} rounded-full"
		>
			{#if trashActive}
				<Icon icon="mdi:trash-can-empty" class="size-14 cursor-pointer text-red-700" />
			{:else}
				<Icon icon="mdi:trash" class="size-14 cursor-pointer" />
			{/if}
		</div>
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="flex aspect-1/5 h-2/5 flex-col"
		ondragend={(e) => (activeDropBox = null)}
		ondragleave={(e) => (activeDropBox = null)}
		ondragover={dragover}
		ondrop={(e) => drop(e, activeDropBox ?? lights.length, true)}
	>
		<Navestidlo
			{label}
			labelStyleClass={labelStyleClass ?? undefined}
			poleStyleClass={poleStyleClass ?? undefined}
		>
			{#snippet renderLights()}
				{#each lights as light, i}
					<div
						class="aspect-square rounded-full border-3 border-dotted border-amber-300 {activeDropBox ===
						i
							? ''
							: 'hidden'}"
						ondragover={(e) => (e.preventDefault(), (activeDropBox = i))}
						ondrop={(e) => drop(e, i, true)}
					></div>
					<div
						class="light mt-[6%] mb-[6%] aspect-square rounded-full {activeLights[i] !== false
							? customColorClasses[light]
							: colors.blank} {mode === Mode.MANUAL ? 'cursor-pointer' : ''} {typeof activeLights[
							i
						] === 'string'
							? activeLights[i]
							: ''}"
						draggable="true"
						ondragstart={(e) => e.dataTransfer?.setData('light', `${light};${i}`)}
						bind:this={lightElements[i]}
						ondrop={(e) => activeDropBox && drop(e, activeDropBox, true)}
						onclick={() => mode === Mode.MANUAL && cycleLight(i)}
					></div>
				{/each}
				<div
					class="aspect-square rounded-full border-3 border-dotted {activeDropBox === lights.length
						? 'border-amber-300'
						: lights.length === 0
							? 'border-gray-600'
							: 'hidden'}"
					ondragover={(e) => (e.preventDefault(), (activeDropBox = lights.length))}
					ondrop={(e) => drop(e, lights.length, true)}
				></div>
			{/snippet}
			{#snippet topSigns()}
				{#if selectedSigns.includes('skratena_vzd')}
					<SkratenaVzdialenost />
				{/if}
				{#if selectedSigns.includes('skupinove')}
					<Skupina />
				{/if}
			{/snippet}
			{#snippet bottomSigns()}
				{#if selectedSigns.includes('predzvest_k')}
					<PredzvestVyhybky />
				{/if}
				{#if selectedSigns.includes('predzvest_nk')}
					<PredzvestBezVyhybiek />
				{/if}
			{/snippet}
		</Navestidlo>
	</div>
</DayNight>
<div class="flex w-1/5 flex-col bg-gray-500 p-5">
	<button onclick={() => (store.day = !store.day)} class="ml-auto cursor-pointer rounded-md p-1">
		{#if store.day}
			<Icon icon="bi:moon-stars-fill" class="h-6 w-6" />
		{:else}
			<Icon icon="bi:sun-fill" class="h-6 w-6" />
		{/if}
	</button>

	<div>
		<label for="label">Označenie</label>
		<div class="flex">
			<input
				type="text"
				bind:value={label}
				id="label"
				name="label"
				class="mt-1 block w-full rounded-l bg-gray-100 p-1"
			/>
		</div>
	</div>
	<div>
		<label for="labelStyleClass">Štýl označenia</label>
		<select
			bind:value={labelStyleClass}
			id="labelStyleClass"
			name="labelStyleClass"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
		>
			<option value={null}>---</option>
			<option value="hlavne">Hlavné</option>
			<option value="predzvest">Samostatná predzvesť</option>
			<option value="autoblok">Návestidlo automatického bloku</option>
			<option value="zriadovacie">Zriaďovacie</option>
		</select>
	</div>
	<div>
		<label for="poleStyleClass">Štýl stĺpika</label>
		<select
			bind:value={poleStyleClass}
			id="poleStyleClass"
			name="poleStyleClass"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
		>
			<option value={null}>---</option>
			<option value="hlavne">Hlavné</option>
			<option value="hlavne_jazda">Hlavné (platné iba pre jazdu vlaku)</option>
			<option value="vlozene">Vložené</option>
			<option value="predzvest">Samostatná predzvesť</option>
			<option value="autoblok">Návestidlo automatického bloku</option>
			<option value="zriadovacie">Zriaďovacie</option>
		</select>
	</div>

	<!-- multi select for signs -->
	<div>
		<label for="signs">Značky</label>
		<select
			bind:value={selectedSigns}
			id="signs"
			name="signs"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
			multiple
		>
			{#each availableSigns as sign}
				<option value={sign}>{signNames[sign]}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="lightsMode">Režim</label>
		<select
			bind:value={mode}
			id="lightsMode"
			name="lightsMode"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
		>
			{#each Object.values(Mode) as value}
				<option {value}>{modeNames[value]}</option>
			{/each}
		</select>
	</div>
	{#if mode === Mode.BUILD}
		<i class="text-sm">
			Svetlá je možné umiestniť na návestidlo potiahnutím.Svetlá na návestidle je možné potiahnuť na
			iné miesto alebo vymazať potiahnutím na ikonu koša.
		</i>
	{:else if mode === Mode.MANUAL}
		<i class="text-sm"
			>Kliknutím na svetlo prepneš jeho režim. Režimy idú v poradí: vypnuté, zapnuté, pomalé
			blikanie, rýchle blikanie.</i
		>
	{:else if mode === Mode.SIGNAL}
		<label for="signal">Návesť</label>
		<select
			bind:value={signal}
			id="signal"
			name="signal"
			class="mt-1 block
			w-full rounded-l bg-gray-100 p-1"
		>
			<option value={null}>---</option>
			{#each vsetkyNavesti as navest}
				<option value={navest} disabled={!availableSignals.includes(navest)}
					>{nazvyNavesti[navest]}</option
				>
			{/each}
		</select>
		<div>
			<label for="repeating">Opakovanie</label>
			<input
				bind:checked={repeating}
				disabled={!repeatingAvailable}
				id="repeating"
				name="repeating"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
		<div>
			<label for="privolavacia">Privolávacia návesť</label>
			<input
				bind:checked={privolavacia}
				disabled={!privolavaciaAvailable}
				id="privolavacia"
				name="privolavacia"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
	{/if}
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>

<style lang="scss">
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
