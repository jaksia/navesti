<script lang="ts">
	import { RezimSpadoviska } from '$lib/spadovisko';
	import SpadoviskoveNavestidlo from '$lib/SpadoviskoveNavestidlo.svelte';

	let track = $state(1);
	let mode = $state(RezimSpadoviska.ZAKAZANE);
</script>

<div class="relative flex flex-grow items-center justify-center bg-green-200">
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
					<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
						<SpadoviskoveNavestidlo {mode} type="kmenove" label="Sp101" />
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
				<td></td>
				<td class="text-center font-bold">Spojenie koľají</td>
				<td></td>
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
					<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
						<SpadoviskoveNavestidlo
							mode={track == 1 ? mode : RezimSpadoviska.ZAKAZANE}
							type="opakovacie"
							label="IOSp101"
						/>
					</div>
				</td>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
						<SpadoviskoveNavestidlo
							mode={track == 2 ? mode : RezimSpadoviska.ZAKAZANE}
							type="opakovacie"
							label="IIOSp101"
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
					<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
						<SpadoviskoveNavestidlo
							mode={track == 1 ? mode : RezimSpadoviska.ZAKAZANE}
							type="zriadovacie"
							label="Se25"
						/>
					</div>
				</td>
				<td><img src="/track/straight.svg" alt="Track" /></td>
				<td class="relative">
					<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
						<SpadoviskoveNavestidlo
							mode={track == 2 ? mode : RezimSpadoviska.ZAKAZANE}
							type="hlavne"
							label="S101"
						/>
					</div>
				</td>
			</tr>
			<tr>
				<td class="text-center font-bold">1. koľaj</td>
				<td></td>
				<td class="text-center font-bold">2. koľaj</td>
				<td></td>
			</tr>
		</tbody>
	</table>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<div>
		<label for="track">Koľaj</label>
		<input type="number" bind:value={track} min="1" max="2" />
	</div>
	<div>
		<label for="mode">Režim spádoviska</label>
		<select bind:value={mode}>
			{#each Object.values(RezimSpadoviska) as value}
				<option {value}>{value}</option>
			{/each}
		</select>
	</div>
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>

<style lang="scss">
</style>
