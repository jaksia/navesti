<script lang="ts">
	import Square from '$lib/components/szz/lines/Square.svelte';
	import Straight from '$lib/components/szz/lines/Straight.svelte';
	import Switch from '$lib/components/szz/lines/Switch.svelte';
	import { DNV } from '$lib/components/szz/stations/dnv';
	import type { Station } from '$lib/components/szz/types';

	let station: Station = DNV;

	let segmentStates = $state({}) as Record<string, number>;
</script>

<table class="h-min w-full">
	<tbody>
		{#each station.tiles as tileLine, i}
			<tr>
				{#each tileLine as tile, j}
					{#if tile[0] == 'blank'}
						{#each Array.from({ length: tile[1] }) as _}
							<td></td>
						{/each}
					{:else if tile[0] == 'straight'}
						{#each Array.from({ length: tile[1] }) as _}
							<td
								onclick={() =>
									(segmentStates[`${i}-${j}`] = ((segmentStates[`${i}-${j}`] ?? 0) + 1) % 3)}
							>
								<Straight
									light
									occupied={segmentStates[`${i}-${j}`] == 0
										? false
										: segmentStates[`${i}-${j}`] == 1
											? true
											: undefined}
								/>
							</td>
						{/each}
					{:else if tile[0] == 'switch'}
						<td
							onclick={() =>
								(segmentStates[`${i}-${j}`] = ((segmentStates[`${i}-${j}`] ?? 0) + 1) % 3)}
						>
							<Switch
								direction={tile[1]}
								straight={true}
								switching={false}
								occupied={segmentStates[`${i}-${j}`] == 0
									? false
									: segmentStates[`${i}-${j}`] == 1
										? true
										: undefined}
							/>
						</td>
					{:else}
						<td
							onclick={() =>
								(segmentStates[`${i}-${j}`] = ((segmentStates[`${i}-${j}`] ?? 0) + 1) % 3)}
						>
							<Square
								rotation1={tile[0]}
								rotation2={tile[1]}
								light
								occupied={segmentStates[`${i}-${j}`] == 0
									? false
									: segmentStates[`${i}-${j}`] == 1
										? true
										: undefined}
							/>
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	:global .segment {
		position: relative;
		background-color: var(--color-yellow-950);

		&::before {
			content: '';
			position: absolute;
			inset: 0;

			transition: opacity 1s;
			opacity: 0;
		}

		&::after {
			content: '';
			position: absolute;
			inset: 0;

			transition: opacity 1s;
			opacity: 0;
		}

		&.vacant::after {
			opacity: 1;
		}

		&.occupied::before {
			opacity: 1;
		}

		&.blinking.occupied::before {
			opacity: 1;
			animation: blink 0.5s infinite;
		}

		&.blinking.vacant::after {
			opacity: 1;
			animation: blink 0.5s infinite;
		}

		&::after {
			--stop-1: color-mix(in oklab, var(--color-yellow-200) 50%, transparent);
			--stop-2: color-mix(in oklab, var(--color-yellow-200) 80%, transparent);
			--stop-3: color-mix(in oklab, var(--color-yellow-200) 100%, transparent);
			--stop-4: var(--stop-2);
			background-image: linear-gradient(
				90deg,
				var(--stop-1) 0%,
				var(--stop-2) 70%,
				var(--stop-3) 85%,
				var(--stop-4) 100%
			);
		}

		&::before {
			--stop-1: color-mix(in oklab, var(--color-red-500) 70%, transparent);
			--stop-2: color-mix(in oklab, var(--color-red-500) 80%, transparent);
			--stop-3: var(--stop-1);
			--stop-4: color-mix(in oklab, var(--color-red-500) 40%, transparent);

			background-image: linear-gradient(
				90deg,
				var(--stop-1) 0%,
				var(--stop-2) 15%,
				var(--stop-3) 30%,
				var(--stop-4) 100%
			);
		}

		&.segment-svg-0 {
			stroke: var(--color-yellow-950);
		}

		&.segment-svg-1 {
			stroke: color-mix(in oklab, var(--color-yellow-200) 80%, transparent);
			opacity: 0;
		}

		&.segment-svg-2 {
			stroke: color-mix(in oklab, var(--color-red-500) 80%, transparent);
			opacity: 0;
		}

		&.vacant.segment-svg-2 {
			opacity: 1;
		}

		&.occupied.segment-svg-1 {
			opacity: 1;
		}
	}
</style>
