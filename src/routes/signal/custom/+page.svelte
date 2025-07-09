<script lang="ts">
	import { blinking, colors } from '$lib/consts/styles';
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
	import type { Additional, Navest } from '$lib/types/navestidlo';
	import { additionalNames, nazvyNavesti, vsetkyNavesti } from '$lib/consts/navestidlo';
	import DayNight from '$lib/components/DayNight.svelte';
	import SkratenaVzdialenost from '$lib/components/navestidla/signs/SkratenaVzdialenost.svelte';
	import Skupina from '$lib/components/navestidla/signs/Skupina.svelte';
	import PredzvestVyhybky from '$lib/components/navestidla/signs/PredzvestVyhybky.svelte';
	import PredzvestBezVyhybiek from '$lib/components/navestidla/signs/PredzvestBezVyhybiek.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import { browser } from '$app/environment';
	import PoslednyAutoblok from '$lib/components/navestidla/signs/PoslednyAutoblok.svelte';

	type Sign = Additional | 'predzvest_k' | 'predzvest_nk' | 'posledny_autoblok';

	let mode: Mode = $state(Mode.BUILD);

	let lights: CustomLightColor[] = $state([]);
	let activeLights: LightMode[] = $state([]);
	let lightElements: HTMLElement[] = $state([]);
	let speedLight = $state(false);
	let speedStripes = $state(false);

	const signalModeAvailable = $derived(
		Object.values(CustomLightColor).every(
			(color) => lights.filter((l) => l === color).length <= maxLightCounts[color]
		)
	);

	let signal: Navest | null = $state(null);
	let availableSignals: Navest[] = $derived(availableSignalsF(lights));
	let speed: number | null = $state(null);

	let repeating = $state(false);
	let repeatingAvailable = $derived(canRepeat(lights, signal));

	let privolavacia = $state(false);
	let privolavaciaAvailable = $derived(canPrivolavacia(lights, signal));

	let label = $state('');
	let labelStyleClass: string | null = $state(null);
	let poleStyleClass: string | null = $state(null);

	const availableSigns = [
		'skratena_vzd',
		'skupinove',
		'predzvest_k',
		'predzvest_nk',
		'posledny_autoblok'
	] as Sign[];
	const signNames = {
		...additionalNames,
		predzvest_k: 'Hl. návestidlo kryje výhybky',
		predzvest_nk: 'Hl. návestidlo nekryje výhybky',
		posledny_autoblok: 'Posledné návestidlo autobloku'
	} as Record<Sign, string>;
	let selectedSigns: Sign[] = $state([]);

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
				pattern[lights.indexOf(CustomLightColor.WHITE)] = 'slow';
			}
			activeLights = pattern;
		}

		if (!speedLight) ((speed = null), (speedStripes = false));
	});

	let activeDropBox: number | null = $state(null);
	let dragData: string | null = $state(null);
	let trashActive = $state(false);

	function dragover(event: DragEvent) {
		event.preventDefault();
		if (mode !== Mode.BUILD || !dragData) return;
		const [type, ...data] = dragData.split(';');
		if (type === 'light') {
			activeDropBox = lightElements.findIndex((el, i) => {
				const rect = el.getBoundingClientRect();
				const thirdY =
					i == activeDropBox ? rect.top + (rect.height * 2) / 3 : rect.top + rect.height / 3;
				return event.clientY <= thirdY;
			});
			if (activeDropBox === -1) activeDropBox = lights.length;
		} else if (type === 'speed') {
			if ((data[0] === 'stripes' && speedStripes) || (data[0] === 'light' && speedLight)) return;
			activeDropBox = lights.length + (data[0] === 'light' ? 0 : 1);
		}
	}

	function drop(event: DragEvent, i: number, insert: boolean) {
		event.preventDefault();
		event.stopPropagation();
		if (!dragData) return;
		const [type, ...data] = dragData.split(';');
		dragData = null;
		if (type === 'light') {
			const color = data[0] as CustomLightColor,
				origPos = parseInt(data[1]);

			((activeDropBox = null), (trashActive = false));

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
		} else if (type === 'speed') {
			const speedType = data[0];
			if (speedType === 'light') {
				speedLight = i !== -1;
			} else if (speedType === 'stripes') {
				speedStripes = i !== -1;
			}
		}
	}

	function dragend() {
		((activeDropBox = null), (trashActive = false), (dragData = null));
	}

	function cycleLight(i: number) {
		const list = [false, true, 'slow', 'fast'] as LightMode[];
		const index = list.indexOf(activeLights[i]);
		activeLights[i] = list[(index + 1) % list.length];
	}

	function cycleSpeed() {
		if (!speedLight) return;
		const list = speedStripes ? [null, 40, 60, 80, 100] : [null, 40];
		const index = list.indexOf(speed);
		speed = list[(index + 1) % list.length];
	}

	const secrets = {
		all: () => {
			lights = Object.values(CustomLightColor);
			speedLight = speedStripes = true;
		},
		reset: () => {
			lights = activeLights = [];
			speedLight = speedStripes = false;
		},
		default: () => {
			lights = [
				CustomLightColor.YELLOW,
				CustomLightColor.GREEN,
				CustomLightColor.RED,
				CustomLightColor.WHITE
			];
			speedLight = speedStripes = true;
		},
		wave: () => {
			mode = Mode.MANUAL;
			activeLights = lights.map(() => false);
			let i = 0;
			const interval = setInterval(() => {
				activeLights[i] = 'slow';
				i += 1;
				if (i >= lights.length) clearInterval(interval);
			}, 1000 / lights.length);
		},
		sync: () => {
			const oldActiveLights = activeLights;
			activeLights = lights.map(() => false);
			setTimeout(() => {
				activeLights = oldActiveLights;
			}, 100);
		}
	};

	let word = $state('');
</script>

<svelte:head>
	<title>Vlastné návestidlo</title>
</svelte:head>
<svelte:body
	ondragend={dragend}
	ondragstart={(event) => mode !== Mode.BUILD && event.preventDefault()}
	ondragover={(event) => event.preventDefault()}
	ondrop={(event) => event.preventDefault()}
	onkeydown={(event) => {
		if (event.key.match(/^[a-zA-Z0-9]$/)) {
			word += event.key.toLowerCase();

			let maxLen = 0;
			for (const [secret, action] of Object.entries(secrets)) {
				maxLen = Math.max(maxLen, secret.length);
				if (word.endsWith(secret)) {
					action();
					word = '';
				}
			}
			if (word.length > maxLen) word = word.slice(-maxLen);
		}
	}}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<DayNight class="flex grow flex-col items-center justify-between">
	<div class="mt-10 flex gap-1 text-center">
		{#if mode === Mode.BUILD}
			<table class="border-separate border-spacing-2 text-stone-950 dark:text-stone-300">
				<thead>
					<tr>
						<th colspan={Object.values(CustomLightColor).length}>Svetlá</th>
						<th></th>
						<th colspan="2">Rýchlosť</th>
						<th></th>
						<th>Kôš</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						{#each Object.values(CustomLightColor) as color}
							<td
								class={['size-14 rounded-full text-2xl', customColorClasses[color]]}
								draggable="true"
								ondragstart={() => (dragData = `light;${color};-1`)}
							></td>
						{/each}
						<td class="px-1"></td>
						<td
							class={['size-14 rounded-full text-2xl', colors.yellow, speedLight ? 'disabled' : '']}
							draggable={!speedLight}
							ondragstart={() => (dragData = `speed;light`)}
						></td>
						<td
							class={[
								'flex size-14 flex-col justify-center',
								!speedStripes && speedLight ? '' : 'disabled'
							]}
							draggable={!speedStripes && speedLight}
							ondragstart={() => (dragData = `speed;stripes`)}
						>
							<div class={['aspect-6/1', colors.yellow]}></div>
							<div class="aspect-7"></div>
							<div class={['aspect-6/1', colors.green]}></div>
						</td>
						<td class="px-1"></td>
						<td
							ondragover={(e) => (e.preventDefault(), (trashActive = true), (activeDropBox = null))}
							ondragleave={(e) => (trashActive = false)}
							ondrop={(e) => drop(e, -1, true)}
							class="rounded-full text-stone-800 dark:text-stone-600"
						>
							{#if trashActive}
								<Icon icon="mdi:trash-can-empty" class="size-14 cursor-pointer text-red-700" />
							{:else}
								<Icon icon="mdi:trash" class="size-14 cursor-pointer" />
							{/if}
						</td>
					</tr>
				</tbody>
			</table>
		{/if}
	</div>

	<div
		class="flex aspect-1/5 h-2/5 flex-col"
		ondragend={(e) => (activeDropBox = null)}
		ondragleave={(e) => (activeDropBox = null)}
		ondragover={dragover}
		ondrop={(e) => drop(e, activeDropBox ?? lights.length, true)}
	>
		<Navestidlo
			{label}
			labelStyleClass={(labelStyleClass ?? undefined) as never}
			poleStyleClass={(poleStyleClass ?? undefined) as never}
		>
			{#snippet renderBlankLights()}
				{#each lights as light, i}
					<div
						class={[
							'aspect-square rounded-full border-3 border-dotted border-amber-300',
							activeDropBox === i ? '' : 'hidden'
						]}
						ondrop={(e) => drop(e, i, true)}
					></div>
					<div class={['light mt-[6%] mb-[6%] aspect-square rounded-full', colors.blank]}></div>
				{/each}
				<div
					class={[
						'aspect-square rounded-full border-3 border-dotted',
						activeDropBox === lights.length
							? 'border-amber-300'
							: lights.length === 0 && !speedLight
								? 'border-gray-600'
								: 'hidden'
					]}
					ondrop={(e) => drop(e, lights.length, true)}
				></div>
				{#if speedLight}
					<div
						class={['light aspect-square rounded-full', speedLight ? colors.blank : 'hidden']}
					></div>
				{/if}
				{#if speedStripes}
					<div>
						<div class={['light stripe !m-0 aspect-6/1', colors.blank]}></div>
						<div class="!m-0 aspect-7/1"></div>
						<div class={['light stripe !m-0 aspect-6/1', colors.blank]}></div>
					</div>
				{/if}
				<div
					class={[
						'aspect-2/1 border-3 border-dotted border-amber-300',
						activeDropBox === lights.length + 1 ? '' : 'hidden'
					]}
					ondrop={(e) => drop(e, lights.length + 1, true)}
				></div>
			{/snippet}
			{#snippet renderLights()}
				{#each lights as light, i}
					<div
						class={[
							'aspect-square rounded-full border-3 border-transparent',
							activeDropBox === i ? '' : 'hidden'
						]}
						ondrop={(e) => drop(e, i, true)}
					></div>
					<div
						class={[
							'light mt-[6%] mb-[6%] aspect-square rounded-full',
							activeLights[i] === false ? colors.transparent : customColorClasses[light],
							mode === Mode.MANUAL ? 'cursor-pointer' : '',
							typeof activeLights[i] === 'string' ? blinking[activeLights[i]] : ''
						]}
						draggable="true"
						ondragstart={() => (dragData = `light;${light};${i}`)}
						bind:this={lightElements[i]}
						ondrop={(e) => activeDropBox && drop(e, activeDropBox, true)}
						onclick={() => mode === Mode.MANUAL && cycleLight(i)}
					></div>
				{/each}
				<div
					class={[
						'aspect-square rounded-full border-3 border-transparent',
						activeDropBox === lights.length || (lights.length === 0 && !speedLight) ? '' : 'hidden'
					]}
					ondrop={(e) => drop(e, lights.length, true)}
				></div>
				{#if speedLight}
					<div
						class={[
							'light aspect-square rounded-full',
							speed != null || mode === Mode.BUILD ? colors.yellow : colors.transparent
						]}
						onclick={() => mode === Mode.MANUAL && cycleSpeed()}
						draggable="true"
						ondragstart={() => (dragData = `speed;light`)}
					></div>
				{/if}
				{#if speedStripes}
					<div draggable="true" ondragstart={() => (dragData = `speed;stripes`)}>
						<div
							class={[
								'light stripe !m-0 aspect-6/1',
								speed === 60 || mode == Mode.BUILD
									? colors.yellow
									: [80, 100].includes(speed ?? -1)
										? colors.green
										: colors.transparent
							]}
							onclick={() => mode === Mode.MANUAL && cycleSpeed()}
						></div>
						<div class="!m-0 aspect-7/1"></div>
						<div
							class={[
								'light stripe !mt-0 aspect-6/1',
								speed === 100 || mode == Mode.BUILD ? colors.green : colors.transparent
							]}
							onclick={() => mode === Mode.MANUAL && cycleSpeed()}
						></div>
					</div>
				{/if}
				<div
					class={[
						'aspect-2/1 border-3 border-transparent',
						activeDropBox === lights.length + 1 ? '' : 'hidden'
					]}
					ondrop={(e) => drop(e, lights.length + 1, true)}
				></div>
			{/snippet}
			{#snippet topSigns()}
				{#if selectedSigns.includes('skratena_vzd')}
					<SkratenaVzdialenost />
				{/if}
				{#if selectedSigns.includes('skupinove')}
					<Skupina />
				{/if}
				{#if selectedSigns.includes('posledny_autoblok')}
					<PoslednyAutoblok />
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
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />

	<label for="label" class="floating-label">
		<span>Označenie</span>
		<div class="flex">
			<input type="text" bind:value={label} id="label" name="label" class="input" />
		</div>
	</label>
	<label for="labelStyleClass" class="floating-label">
		<span>Štýl označenia</span>
		<select bind:value={labelStyleClass} id="labelStyleClass" name="labelStyleClass" class="select">
			<option value={null}>---</option>
			<option value="hlavne">Hlavné</option>
			<option value="predzvest">Samostatná predzvesť</option>
			<option value="autoblok">Návestidlo automatického bloku</option>
			<option value="zriadovacie">Zriaďovacie</option>
		</select>
	</label>
	<label for="poleStyleClass" class="floating-label">
		<span>Štýl stĺpika</span>
		<select bind:value={poleStyleClass} id="poleStyleClass" name="poleStyleClass" class="select">
			<option value={null}>---</option>
			<option value="hlavne">Hlavné</option>
			<option value="hlavne_jazda">Hlavné (platné iba pre jazdu vlaku)</option>
			<option value="vlozene">Vložené</option>
			<option value="predzvest">Samostatná predzvesť</option>
			<option value="autoblok">Návestidlo automatického bloku</option>
			<option value="zriadovacie">Zriaďovacie</option>
		</select>
	</label>

	<!-- multi select for signs -->
	<label for="signs" class="floating-label">
		<span>Značky</span>
		<select bind:value={selectedSigns} id="signs" name="signs" class="textarea" multiple>
			{#each availableSigns as sign}
				<option value={sign}>{signNames[sign]}</option>
			{/each}
		</select>
	</label>

	<label for="lightsMode" class="floating-label">
		<span>Režim</span>
		<select bind:value={mode} id="lightsMode" name="lightsMode" class="select">
			{#each Object.values(Mode) as value}
				<option {value} disabled={!signalModeAvailable && value === Mode.SIGNAL}
					>{modeNames[value]}</option
				>
			{/each}
		</select>
	</label>

	{#if mode === Mode.BUILD}
		<i class="text-sm">
			Svetlá je možné umiestniť na návestidlo potiahnutím. Svetlá na návestidle je možné potiahnuť
			na iné miesto alebo vymazať potiahnutím na ikonu koša.
		</i>
		{#if !signalModeAvailable}
			<i class="text-sm text-red-700">
				Režim "podľa návesti" nie je možné použiť v aktuálnom nastavení svetiel.
			</i>
		{/if}
	{:else if mode === Mode.MANUAL}
		<i class="text-sm"
			>Kliknutím na svetlo prepneš jeho režim. Režimy idú v poradí: vypnuté, zapnuté, pomalé
			blikanie, rýchle blikanie.</i
		>
	{:else if mode === Mode.SIGNAL}
		<label for="signal" class="floating-label">
			<span>Návesť</span>
			<select bind:value={signal} id="signal" name="signal" class="select">
				<option value={null}>---</option>
				{#each vsetkyNavesti as navest}
					<option value={navest} disabled={!availableSignals.includes(navest)}
						>{nazvyNavesti[navest]}</option
					>
				{/each}
			</select>
		</label>
		<label for="speed" class="floating-label">
			<span>Rýchlosť</span>
			<select bind:value={speed} id="speed" name="speed" disabled={!speedLight} class="select">
				<option value={null}>---</option>
				<option value={40}>40 km/h</option>
				<option value={60} disabled={!speedStripes}>60 km/h</option>
				<option value={80} disabled={!speedStripes}>80 km/h</option>
				<option value={100} disabled={!speedStripes}>100 km/h</option>
			</select>
		</label>
		<fieldset class="fieldset border-base-300 rounded-box border p-2">
			<legend class="fieldset-legend">Ďalšie možnosti</legend>
			<label for="repeating" class="fieldset-label">
				<input
					bind:checked={repeating}
					disabled={!repeatingAvailable}
					id="repeating"
					name="repeating"
					type="checkbox"
					class="checkbox"
				/>
				Opakovanie
			</label>
			<label for="privolavacia" class="fieldset-label">
				<input
					bind:checked={privolavacia}
					disabled={!privolavaciaAvailable}
					id="privolavacia"
					name="privolavacia"
					type="checkbox"
					class="checkbox"
				/>
				Privolávacia návesť
			</label>
		</fieldset>
	{/if}
	<a href="/signal/" class="mt-auto font-bold underline">Naspäť</a>
</div>

<style lang="scss">
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
