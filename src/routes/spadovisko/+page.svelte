<script lang="ts">
	import { RezimSpadoviska, spadNavestneZnaky } from '$lib/spadovisko';
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import Navestidlo from '$lib/components/navestidla/Navestidlo.svelte';

	const NUM_TRACKS = 2;

	let track = $state(1);
	let mode: RezimSpadoviska = $state(RezimSpadoviska.ZAKAZANE);

	let letters = $derived({
		U_: ![RezimSpadoviska.SPAT, RezimSpadoviska.ZAKAZANE].includes(mode),
		Z: mode == RezimSpadoviska.SPAT
	});

	let trackMode = $derived(
		Array.from({ length: NUM_TRACKS }).reduce((acc: Record<number, RezimSpadoviska>, _, i) => {
			acc[i + 1] = i + 1 === track ? mode : RezimSpadoviska.ZAKAZANE;
			return acc;
		}, {})
	);
</script>

{#snippet singleRail()}
	<tr>
		<td></td>
		<td><img src="/track/straight.svg" alt="Track" /></td>
		<td></td>
		<td></td>
	</tr>
{/snippet}

{#snippet doubleRail()}
	<tr>
		<td><img src="/track/straight.svg" alt="Track" /></td>
		<td></td>
		<td><img src="/track/straight.svg" alt="Track" /></td>
		<td></td>
	</tr>
{/snippet}

<svelte:head>
	<title>Spádovisko</title>
</svelte:head>
<DayNight class="flex">
	<table class="m-auto">
		<thead>
			<tr class="*:w-20"><th></th><th></th><th></th><th></th></tr>
		</thead>
		<tbody>
			{@render singleRail()}
			<tr>
				<td class="p-2 dark:invert-75"><img src="/track/hill.svg" alt="Hill" /></td>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="spad-navestidlo">
						<Navestidlo
							lightCount={3}
							letters={{ Z: mode == RezimSpadoviska.SPAT }}
							activeLights={spadNavestneZnaky['kmenove'][mode]}
							label="Sp101"
							poleStyleClass="zriadovacie"
							labelStyleClass="hlavne"
						/>
					</div>
				</td>
				<td></td>
			</tr>
			{@render singleRail()}
			<tr>
				<td>
					<img src="/track/straight.svg" alt="Track" class="translate-x-1/2 -skew-x-45" />
				</td>
				<td></td>
				<td>
					<img src="/track/straight.svg" alt="Track" class="-translate-x-1/2 skew-x-45" />
				</td>
				<td></td>
			</tr>
			{@render doubleRail()}
			{@render doubleRail()}
			<tr>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="spad-navestidlo">
						<Navestidlo
							lightCount={3}
							letters={{ Z: letters.Z && track == 1 }}
							activeLights={spadNavestneZnaky['opakovacie'][trackMode[1]]}
							label="IOSp101"
							labelStyleClass="zriadovacie"
						/>
					</div>
				</td>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="spad-navestidlo">
						<Navestidlo
							lightCount={3}
							letters={{ Z: letters.Z && track == 2 }}
							activeLights={spadNavestneZnaky['opakovacie'][trackMode[2]]}
							label="IIOSp101"
							labelStyleClass="zriadovacie"
						/>
					</div>
				</td>
			</tr>
			{@render doubleRail()}
			{@render doubleRail()}
			<tr>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="spad-navestidlo">
						<Navestidlo
							lightCount={3}
							letters={{
								U_: letters.U_ && track == 1,
								Z: letters.Z && track == 1
							}}
							activeLights={spadNavestneZnaky['zriadovacie'][trackMode[1]]}
							label="Se25"
							poleStyleClass="zriadovacie"
						/>
					</div>
				</td>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="spad-navestidlo">
						<Navestidlo
							lightCount={3}
							letters={{
								U_: letters.U_ && track == 2,
								Z: letters.Z && track == 2
							}}
							activeLights={spadNavestneZnaky['hlavne'][trackMode[2]]}
							label="Sc101"
							poleStyleClass="hlavne"
						/>
					</div>
				</td>
			</tr>
			<tr>
				<td class="text-center font-bold text-stone-900 dark:text-stone-300">1. koľaj</td>
				<td></td>
				<td class="text-center font-bold text-stone-900 dark:text-stone-300">2. koľaj</td>
				<td></td>
			</tr>
		</tbody>
	</table>
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />
	<label for="track" class="floating-label">
		<span>Koľaj</span>
		<input type="number" bind:value={track} min="1" max="2" class="input" />
	</label>
	<label for="mode" class="floating-label">
		<span>Režim spádoviska</span>
		<select bind:value={mode} class="select">
			{#each Object.values(RezimSpadoviska) as value}
				<option {value}>{value}</option>
			{/each}
		</select>
	</label>
	<a href="/" class="mt-auto font-bold underline">Naspäť</a>
</div>

<style lang="scss">
	:global(.light:not(.letter)) {
		--shadow-size: 15px !important;
	}

	:global(.light.letter) {
		--shadow-size: 10px !important;
	}

	:global(.day-bg) {
		background: var(--color-green-300) !important;
	}

	.spad-navestidlo {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		aspect-ratio: 1 / 3;
		height: 100%;
	}
</style>
