<script lang="ts">
	import { RezimSpadoviska, spadNavestneZnaky } from '$lib/spadovisko';
	import SpadoviskoveNavestidlo from '$lib/components/SpadoviskoveNavestidlo.svelte';
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import Navestidlo from '$lib/components/navestidla/Navestidlo.svelte';
	import { colors } from '$lib/consts';

	let track = $state(1);
	let mode = $state(RezimSpadoviska.ZAKAZANE);
</script>

<svelte:head>
	<title>Spádovisko</title>
</svelte:head>
<DayNight class="flex">
	<div class="relative flex grow items-center justify-center bg-green-300 dark:bg-transparent">
		<table cellspacing="0" cellpadding="0">
			<thead>
				<tr>
					<th class="w-20"></th>
					<th class="w-20"></th>
					<th class="w-20"></th>
					<th class="w-20"></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td class="relative">
						<div class="absolute bottom-0 left-1/2 aspect-1/3 h-full -translate-x-1/2 transform">
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
				<tr>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td class="relative"
						><img
							src="/track/straight.svg"
							alt="Track"
							class="absolute top-0 left-1/2 -skew-x-[45deg]"
						/></td
					>
					<td class="relative"
						><img
							src="/track/straight.svg"
							alt="Track"
							class="absolute top-0 left-1/2 skew-x-[45deg]"
						/></td
					>
					<td><img src="/track/straight.svg" alt="Track" class="opacity-0" /></td>
					<td></td>
				</tr>
				<tr>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
				</tr>
				<tr>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
				</tr>
				<tr>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td class="relative">
						<div class="absolute bottom-0 left-1/2 aspect-1/3 h-full -translate-x-1/2 transform">
							<Navestidlo
								lightCount={3}
								letters={{ Z: mode == RezimSpadoviska.SPAT && track == 1 }}
								activeLights={spadNavestneZnaky['opakovacie'][
									track == 1 ? mode : RezimSpadoviska.ZAKAZANE
								]}
								label="IOSp101"
								poleStyleClass=""
								labelStyleClass="zriadovacie"
							/>
						</div>
					</td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td class="relative">
						<div class="absolute bottom-0 left-1/2 aspect-1/3 h-full -translate-x-1/2 transform">
							<Navestidlo
								lightCount={3}
								letters={{ Z: mode == RezimSpadoviska.SPAT && track == 2 }}
								activeLights={spadNavestneZnaky['opakovacie'][
									track == 2 ? mode : RezimSpadoviska.ZAKAZANE
								]}
								label="IIOSp101"
								poleStyleClass=""
								labelStyleClass="zriadovacie"
							/>
						</div>
					</td>
				</tr>
				<tr>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
				</tr>
				<tr>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td></td>
				</tr>
				<tr>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td class="relative">
						<div class="absolute bottom-0 left-1/2 aspect-1/3 h-full -translate-x-1/2 transform">
							<Navestidlo
								lightCount={3}
								letters={{
									Z: mode == RezimSpadoviska.SPAT && track == 1,
									U: ![RezimSpadoviska.ZAKAZANE, RezimSpadoviska.SPAT].includes(mode) && track == 1
								}}
								activeLights={spadNavestneZnaky['zriadovacie'][
									track == 1 ? mode : RezimSpadoviska.ZAKAZANE
								]}
								label="Se25"
								poleStyleClass="zriadovacie"
								labelStyleClass="zriadovacie"
							/>
						</div>
					</td>
					<td><img src="/track/straight.svg" alt="Track" /></td>
					<td class="relative">
						<div class="absolute bottom-0 left-1/2 aspect-1/3 h-full -translate-x-1/2 transform">
							<Navestidlo
								lightCount={4}
								letters={{
									Z: mode == RezimSpadoviska.SPAT && track == 2,
									U: ![RezimSpadoviska.ZAKAZANE, RezimSpadoviska.SPAT].includes(mode) && track == 2
								}}
								activeLights={spadNavestneZnaky['hlavne'][
									track == 2 ? mode : RezimSpadoviska.ZAKAZANE
								]}
								label="S101"
								poleStyleClass="hlavne"
								labelStyleClass="hlavne"
							/>
						</div>
					</td>
				</tr>
				<tr>
					<td class="text-center font-bold text-stone-900">1. koľaj</td>
					<td></td>
					<td class="text-center font-bold text-stone-900">2. koľaj</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
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
	:global(.light) {
		--shadow-size: 15px !important;
	}
</style>
