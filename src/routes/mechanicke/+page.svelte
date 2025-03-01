<script lang="ts">
	import DayNight from '$lib/components/DayNight.svelte';
	import Label from '$lib/components/navestidla/parts/Label.svelte';
	import { colors } from '$lib/consts';
	import { generateLabel, type LabelType } from '$lib/labels';
	import { nazvyNavesti } from '$lib/navestidlo';
	import store from '$lib/store.svelte';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	const blank = colors.blank;
	const rotations = {
		up: '-rotate-90',
		level: 'rotate-0',
		angle: '-rotate-45'
	};

	let navest = $state('stoj');

	let secondArm = $state(false);
	let yellowArm = $state(false);

	let armRotation = $state(rotations.level);
	let secondArmRotation = $state(rotations.up);
	let yellowRotation = $state(rotations.up);
	let lightColor = $state(colors.red);
	let secondLightColor = $state(blank);

	let predzvest = $state(true);

	$effect(() => {
		if (navest == 'vystraha' && !yellowArm) navest = 'stoj';
		if (navest == '40' && !secondArm) navest = 'volno';

		if (navest == 'volno') {
			armRotation = rotations.angle;
			secondArmRotation = yellowRotation = rotations.up;
			(lightColor = colors.green), (secondLightColor = blank);
		} else if (navest == 'stoj') {
			armRotation = rotations.level;
			secondArmRotation = yellowRotation = rotations.up;
			(lightColor = colors.red), (secondLightColor = blank);
		} else if (navest == 'vystraha') {
			armRotation = rotations.angle;
			secondArmRotation = rotations.up;
			yellowRotation = rotations.level;
			(lightColor = colors.yellow), (secondLightColor = blank);
		} else if (navest == '40') {
			armRotation = secondArmRotation = rotations.angle;
			yellowRotation = rotations.up;
			lightColor = secondLightColor = yellowArm ? colors.yellow : colors.green;
		}

		predzvest = navest == 'stoj' || navest == '40';
	});

	const labelTypes: LabelType[] = ['krycie', 'vchod', 'odchod', 'oddiel'];

	let label = $state(generateLabel(labelTypes[Math.floor(Math.random() * labelTypes.length)]));
</script>

<svelte:head>
	<title>Mechanické návestidlá</title>
</svelte:head>

<DayNight class="flex grow items-end justify-around">
	<div class="pole relative h-3/5 w-4 bg-white transition-colors duration-500">
		<div
			class="light absolute left-full ml-1 size-8 -translate-y-1/2 rounded-full transition-colors duration-500 {predzvest
				? colors.yellow
				: colors.green}"
			style="top: 7.5rem;"
		></div>
		<div
			class="absolute top-0 left-1/2 transition-transform duration-1000 ease-in-out"
			style="transform: {predzvest ? '' : 'rotate3d(1,0,0,88deg)'};"
		>
			<div
				class="arm absolute size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white transition-colors duration-500 dark:border-white/20 dark:bg-white/20"
			></div>
			<div
				class="arm absolute size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-yellow-300 transition-colors duration-500 dark:border-black/50 dark:bg-yellow-300/20"
			></div>
		</div>
		<div class="absolute top-1/2 aspect-square w-[110%]">
			<Label label="Pr{label}" labelStyleClass="predzvest" />
		</div>
	</div>
	<div class="pole hlavne_jazda relative h-4/5 w-4 transition-colors duration-500">
		<div
			class="light absolute left-full ml-1 size-8 -translate-y-1/2 rounded-full transition-colors duration-500 {lightColor}"
			style="top: 5rem;"
		></div>
		{#if secondArm}
			<div
				class="light absolute left-full ml-1 size-8 -translate-y-1/2 rounded-full transition-colors duration-500 {secondLightColor}"
				style="top: 15rem;"
				transition:fade={{ duration: 500 }}
			></div>
		{/if}
		{#if yellowArm}
			<div
				class="absolute left-1/2 transition-transform duration-1000 ease-in-out {yellowRotation} **:transition-colors **:duration-500"
				style="top: 3rem;"
				transition:fade={{ duration: 500 }}
			>
				<div
					class="arm absolute aspect-[4] w-48 -translate-x-[15%] -translate-y-[50%] bg-yellow-300 dark:bg-yellow-300/20"
				>
					<div class="absolute top-0 left-[30%] h-1/5 w-[70%] bg-white dark:bg-white/20"></div>
					<div class="absolute top-[80%] left-[30%] h-1/5 w-[70%] bg-white dark:bg-white/20"></div>
				</div>
			</div>
		{/if}
		<div
			class="absolute left-1/2 transition-transform duration-1000 ease-in-out {armRotation} **:transition-colors **:duration-500"
			style="top: {3}rem;"
		>
			<div
				class="arm absolute aspect-[4] w-48 -translate-x-[15%] -translate-y-[50%] bg-red-600 dark:bg-red-600/20"
			>
				<div class="absolute top-1/3 left-[30%] h-1/3 w-[70%] bg-white dark:bg-white/20"></div>
			</div>
		</div>
		{#if secondArm}
			<div
				class="absolute left-1/2 transition-transform duration-1000 ease-in-out {secondArmRotation} **:transition-colors **:duration-500"
				style="top: {13}rem;"
				transition:fade={{ duration: 500 }}
			>
				<div
					class="arm absolute aspect-[4] w-48 -translate-x-[15%] -translate-y-[50%] bg-red-600 dark:bg-red-600/20"
				>
					<div class="absolute top-1/3 left-[30%] h-1/3 w-[70%] bg-white dark:bg-white/20"></div>
				</div>
			</div>
		{/if}
		<div class="absolute top-1/2 aspect-square w-[110%]">
			<Label {label} labelStyleClass="hlavne" />
		</div>
	</div>
</DayNight>
<div class="flex w-1/5 flex-col bg-gray-500 p-5">
	<button onclick={() => (store.day = !store.day)} class="ml-auto cursor-pointer rounded-md p-1">
		{#if store.day}
			<Icon icon="bi:moon-stars-fill" class="size-6" />
		{:else}
			<Icon icon="bi:sun-fill" class="size-6" />
		{/if}
	</button>
	<div>
		<label for="secondArm">Druhé rameno:</label>
		<input type="checkbox" id="secondArm" bind:checked={secondArm} class="mt-1 block" />
	</div>
	<div>
		<label for="yellowArm">Žlté rameno:</label>
		<input type="checkbox" id="yellowArm" bind:checked={yellowArm} class="mt-1 block" />
	</div>
	<div>
		<label for="navest">Návesť:</label>
		<select id="navest" bind:value={navest} class="mt-1 block rounded-l bg-gray-100 p-1">
			<option value="stoj">{nazvyNavesti['stoj']}</option>
			<option value="volno">{nazvyNavesti['volno']}</option>
			<option value="vystraha" disabled={!yellowArm}>{nazvyNavesti['vystraha']}</option>
			<option value="40" disabled={!secondArm}>Rýchlosť 40 km/h a Výstraha </option>
		</select>
	</div>
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>

<style lang="scss">
	.pole {
		&.hlavne_jazda {
			background-image: linear-gradient(
				to bottom,
				#fff 12.5%,
				#f00 12.5%,
				#f00 25%,
				#fff 25%,
				#fff 37.5%,
				#f00 37.5%,
				#f00 50%,
				#fff 50%,
				#fff 62.5%,
				#f00 62.5%,
				#f00 75%,
				#fff 75%,
				#fff 87.5%,
				#f00 87.5%,
				#f00 100%
			);
		}
	}
	:global(.night .pole)::before,
	:global(.night .label)::before {
		background-color: #000c !important;
	}
</style>
