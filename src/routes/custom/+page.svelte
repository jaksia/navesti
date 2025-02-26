<script lang="ts">
	import { dev } from '$app/environment';
	import { colors } from '$lib/consts';
	import { customColorClasses, CustomLightColor, Mode, maxLightCounts } from '$lib/custom';
	import Icon from '@iconify/svelte';
	import { untrack } from 'svelte';
	import Navestidlo from '$lib/components/navestidla/Navestidlo.svelte';

	let day = $state(true);

	let mode: Mode = $state(Mode.BUILD);

	let label = $state('');
	let labelStyleClass: string | null = $state(null);
	let poleStyleClass: string | null = $state(null);

	let lights: CustomLightColor[] = $state([]);
	let activeLights: boolean[] = $state([]);
	let lightElements: HTMLElement[] = $state([]);

	$effect(() => {
		const [oldLE] = untrack(() => [lightElements]);
		lightElements = oldLE.slice(0, lights.length);

		if (mode === Mode.BUILD) {
			activeLights = lights.map(() => true);
		} else if (mode === Mode.MANUAL) {
			// Do nothing
		} else if (mode === Mode.SIGNAL) {
			// TODO: Implement
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
	let devMouse: number[] | null = $state(null);

	function dragover(event: DragEvent) {
		if (!isValidDrag(event)) return;
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
		if (!isValidDrag(event)) return;
		const data = event.dataTransfer?.getData('text').split(';') ?? [];
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
		(activeDropBox = null), (trashActive = false), (devMouse = null);
	}

	function isValidDrag(event: DragEvent) {
		if (
			!event.dataTransfer?.types.includes('text') &&
			!event.dataTransfer?.types.includes('text/plain')
		)
			return false;
		const data = event.dataTransfer?.getData('text').split(';');
		if (data?.length !== 2) return false;
		if (!Object.values(CustomLightColor).includes(data[0] as CustomLightColor)) return false;
		if (data[1] === '-1') return true;
		const pos = parseInt(data[1]);
		return pos >= 0 && pos < lights.length;
	}
</script>

<svelte:body
	ondragend={dragend}
	ondragstart={(event) => mode !== Mode.BUILD && event.preventDefault()}
	ondragover={(event) => ((devMouse = [event.clientX, event.clientY]), event.preventDefault())}
	ondrop={(event) => (event.preventDefault(), (devMouse = null))}
/>
{#if dev && devMouse}
	<div
		class="pointer-events-none fixed z-50 w-14 -translate-x-1/2 border-t-2 border-dotted border-black"
		style="top:{devMouse[1]}px; left:{devMouse[0]}px;"
	></div>
{/if}

<div
	class="relative flex grow flex-col items-center justify-between {day
		? 'day bg-linear-to-t from-lime-300 via-cyan-200 to-cyan-300'
		: 'night bg-radial-[at_95%_5%] from-gray-600 to-gray-800 to-20%'}"
>
	{#if !day}
		<div
			class="absolute top-[5%] left-[95%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 drop-shadow-2xl"
		></div>
	{/if}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mt-10 flex gap-1">
		{#each Object.values(CustomLightColor) as color}
			<div
				class="flex size-14 items-center justify-center rounded-full text-2xl {customColorClasses[
					color
				]} {colorCount[color] >= maxLightCounts[color] || mode !== Mode.BUILD ? 'disabled' : ''}"
				draggable={colorCount[color] >= maxLightCounts[color] ? 'false' : 'true'}
				ondragstart={(e) => e.dataTransfer?.setData('text', `${color};-1`)}
			>
				{maxLightCounts[color] - (colorCount[color] ?? 0)}
			</div>
		{/each}

		<div
			ondragover={(e) =>
				isValidDrag(e) && (e.preventDefault(), (trashActive = true), (activeDropBox = null))}
			ondragleave={(e) => isValidDrag(e) && (trashActive = false)}
			ondrop={(e) => drop(e, -1, true)}
			class="ml-2 {mode !== Mode.BUILD ? 'disabled' : ''}"
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
		ondragend={(e) => isValidDrag(e) && (activeDropBox = null)}
		ondragleave={(e) => isValidDrag(e) && (activeDropBox = null)}
		ondragover={dragover}
	>
		<Navestidlo
			{label}
			labelStyleClass={labelStyleClass ?? undefined}
			poleStyleClass={poleStyleClass ?? undefined}
		>
			{#snippet renderLights()}
				{#each lights as light, i}
					<div
						class="size-14 rounded-full border-3 border-dashed border-amber-300 {activeDropBox === i
							? ''
							: 'hidden'}"
						ondragover={(e) => isValidDrag(e) && (e.preventDefault(), (activeDropBox = i))}
						ondrop={(e) => drop(e, i, true)}
					></div>
					<div
						class="relative mt-[6%] mb-[6%] size-14 rounded-full {activeLights[i]
							? customColorClasses[light]
							: colors.blank} {mode === Mode.MANUAL ? 'cursor-pointer' : ''}"
						draggable="true"
						ondragstart={(e) => e.dataTransfer?.setData('text', `${light};${i}`)}
						bind:this={lightElements[i]}
						ondrop={(e) => isValidDrag(e) && activeDropBox && drop(e, activeDropBox, true)}
						onclick={() => mode === Mode.MANUAL && (activeLights[i] = !activeLights[i])}
					>
						{#if dev}
							<div class="absolute top-1/3 w-full border-t-2 border-dotted border-black"></div>
							<div class="absolute top-2/3 w-full border-t-2 border-dotted border-black"></div>
						{/if}
					</div>
				{/each}
				<div
					class="size-14 rounded-full border-3 border-dashed border-amber-300 {activeDropBox ===
					lights.length
						? ''
						: lights.length === 0
							? ''
							: 'hidden'}"
					ondragover={(e) =>
						isValidDrag(e) && (e.preventDefault(), (activeDropBox = lights.length))}
					ondrop={(e) => drop(e, lights.length, true)}
				></div>
			{/snippet}
		</Navestidlo>
	</div>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<button onclick={() => (day = !day)} class="ml-auto cursor-pointer rounded-md p-1">
		{#if day}
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
	<div>
		<label for="lightsMode">Režim svetiel</label>
		<select
			bind:value={mode}
			id="lightsMode"
			name="lightsMode"
			class="mt-1 block w-full rounded-l bg-gray-100 p-1"
		>
			{#each Object.values(Mode) as value}
				<option {value}>{value}</option>
			{/each}
		</select>
	</div>
	{#if mode === Mode.BUILD}
		<!-- TODO: some text -->
	{:else if mode === Mode.MANUAL}
		<i class="text-xs">Kliknutím na svetlo ho zapneš/vypneš</i>
	{:else if mode === Mode.SIGNAL}
		Not yet implemented
	{/if}
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>

<style lang="scss">
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
