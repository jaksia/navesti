<script lang="ts">
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import Label from '$lib/components/navestidla/parts/Label.svelte';
	import { colors } from '$lib/consts/styles';
	import { generateLabel, type LabelType } from '$lib/labels';
	import { nazvyNavesti } from '$lib/consts/navestidlo';
	import { fade } from 'svelte/transition';
	import type { HlavnaNavest } from '$lib/types/navestidlo';

	const rotations = {
		up: '-rotate-90',
		level: '',
		angle: '-rotate-45'
	};
	const firstLightColors = {
		volno: colors.green,
		stoj: colors.red,
		vystraha: colors.yellow
	};

	const labelTypes: LabelType[] = ['krycie', 'vchod', 'odchod', 'oddiel'];
	const label = generateLabel(labelTypes[Math.floor(Math.random() * labelTypes.length)]);

	let navest: Exclude<HlavnaNavest, 60 | 80 | 100> = $state('stoj');

	let secondArm = $state(false);
	let yellowArm = $state(false);

	let firstArmActive = $state(false);
	let secondArmActive = $state(false);

	let firstLightColor = $state(colors.red);
	let secondLightColor = $state(colors.blank);

	let predzvest = $state(true);

	$effect(() => {
		if (navest === 40 && !secondArm) navest = 'volno';
		if (navest === 'volno' && yellowArm) navest = 'vystraha';
		if (navest === 'vystraha' && !yellowArm) navest = 'volno';

		predzvest = [40, 'stoj'].includes(navest);

		firstArmActive = ['volno', 'vystraha', 40].includes(navest);
		secondArmActive = navest === 40;

		if (navest !== 40) firstLightColor = firstLightColors[navest];
		else firstLightColor = yellowArm ? colors.yellow : colors.green;

		secondLightColor = navest === 40 ? firstLightColor : colors.blank;
	});
</script>

<svelte:head>
	<title>Mechanické návestidlá</title>
</svelte:head>

<DayNight class="flex grow items-end justify-around" id="mechanicke-navestidla">
	<div class="pole relative h-3/5 w-4 bg-white">
		<div
			class={[
				'light absolute left-full ml-1 size-8 -translate-y-1/2 rounded-full',
				predzvest ? colors.yellow : colors.green
			]}
			style="top: 7.5rem;"
		></div>
		<div
			class="absolute left-1/2 transition-transform duration-1000 ease-in-out"
			style="transform: {predzvest ? '' : 'rotate3d(1,0,0,88deg)'};"
		>
			<div class="absolute size-56 -translate-x-1/2 -translate-y-1/2 rounded-full">
				<img
					src="/elements/mechanicke/predzvest.svg"
					alt="Predzvest"
					class="size-full dark:hidden"
				/>
				<img
					src="/elements/mechanicke/predzvest-dark.svg"
					alt="Predzvest"
					class="hidden size-full dark:block"
				/>
			</div>
		</div>
		<div class="absolute top-1/2 aspect-square w-[110%]">
			<Label label="Pr{label}" labelStyleClass="predzvest" />
		</div>
	</div>
	<div class="pole hlavne_jazda no-darken relative h-4/5 w-4">
		<div
			class={['light absolute ml-1 size-8 -translate-y-1/2 rounded-full', firstLightColor]}
			style="top: 3rem; left: 1.755rem;"
		></div>
		{#if secondArm}
			<div
				class={['light absolute ml-1 size-8 -translate-y-1/2 rounded-full', secondLightColor]}
				style="top: 13rem; left: 1.755rem;"
				transition:fade={{ duration: 500 }}
			></div>
		{/if}

		<div
			class={[
				'absolute left-1/2 z-10 transition-transform duration-1000 ease-in-out',
				firstArmActive && rotations.angle
			]}
			style="top: {3}rem;"
		>
			<div class="absolute aspect-6/1 w-64 -translate-x-[5%] -translate-y-1/2">
				<img
					src="/elements/mechanicke/first-arm.svg"
					alt="Hlavné rameno"
					class="h-full w-full dark:hidden"
				/>
				<img
					src="/elements/mechanicke/first-arm-dark.svg"
					alt="Hlavné rameno"
					class="hidden h-full w-full dark:block"
				/>
			</div>
		</div>
		{#if yellowArm}
			<div class="absolute left-1/2" style="top: 3rem;" transition:fade={{ duration: 500 }}>
				<div class="absolute aspect-6/1 w-64 -translate-x-[5%] -translate-y-1/2">
					<img
						src="/elements/mechanicke/yellow-arm.svg"
						alt="Žlté rameno"
						class="h-full w-full dark:hidden"
					/>
					<img
						src="/elements/mechanicke/yellow-arm-dark.svg"
						alt="Žlté rameno"
						class="hidden h-full w-full dark:block"
					/>
				</div>
			</div>
		{/if}
		{#if secondArm}
			<div
				class={[
					'absolute left-1/2 z-10 transition-transform duration-1000 ease-in-out',
					secondArmActive ? rotations.angle : rotations.up
				]}
				style="top: 13rem;"
				transition:fade={{ duration: 500 }}
			>
				<div class="absolute aspect-6/1 w-64 -translate-x-[15%] -translate-y-1/2">
					<img
						src="/elements/mechanicke/second-arm.svg"
						alt="Druhé rameno"
						class="size-full dark:hidden"
					/>
					<img
						src="/elements/mechanicke/second-arm-dark.svg"
						alt="Druhé rameno"
						class="hidden size-full dark:block"
					/>
				</div>
			</div>
		{/if}
		<div class="absolute top-1/2 aspect-square w-[110%]">
			<Label {label} labelStyleClass="hlavne" />
		</div>
	</div>
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />
	<fieldset class="fieldset border-base-300 bg-base-200 rounded-box border p-2">
		<legend class="fieldset-legend">Nastavenia ramien</legend>
		<label for="secondArm" class="fieldset-label">
			<input type="checkbox" id="secondArm" bind:checked={secondArm} class="checkbox checkbox-sm" />
			Druhé rameno
		</label>
		<label for="yellowArm" class="fieldset-label">
			<input type="checkbox" id="yellowArm" bind:checked={yellowArm} class="checkbox checkbox-sm" />
			Žlté rameno (pevné)
		</label>
	</fieldset>
	<label for="navest" class="floating-label">
		<span>Návesť</span>
		<select id="navest" bind:value={navest} class="select">
			<option value="stoj">{nazvyNavesti['stoj']}</option>
			<option value="volno" disabled={yellowArm}>{nazvyNavesti['volno']}</option>
			<option value="vystraha" disabled={!yellowArm}>{nazvyNavesti['vystraha']}</option>
			<option value={40} disabled={!secondArm}>Rýchlosť 40 km/h a Výstraha </option>
		</select>
	</label>
	<div class="mt-auto">
		<a href="/" class="mt-auto font-bold underline">Naspäť</a>
	</div>
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
	:global(#mechanicke-navestidla) {
		--night-overlay-color: #000b;
	}
</style>
