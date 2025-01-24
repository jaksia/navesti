<script lang="ts">
	import { dev } from '$app/environment';
	import AutoblokNavestidlo from '$lib/AutoblokNavestidlo.svelte';
	import {
		nazvyNavesti,
		TypNavestidla,
		type HlavnaNavest,
		povoleneNavesti,
		type Rychlost
	} from '$lib/navestidlo';
	import VchodoveNavestidlo from '$lib/VchodoveNavestidlo.svelte';
	import Icon from '@iconify/svelte';

	let vchodNavest: HlavnaNavest = $state('stoj');
	let vchodNavestRychlost: Rychlost | null = $state(null);
	let vchodNavestPrivolavacia = $state(false);
	let pocetOddielov = $state(4);
	const tdCount = $derived(3 + (pocetOddielov - 1) * 5 + 5);

	const poslednyAutoblok = $derived.by(() => {
		if (vchodNavest === 'stoj') return 'vystraha';
		else if (vchodNavestRychlost !== null) return vchodNavestRychlost;
		else return 'volno';
	});

	$effect(() => {
		if (vchodNavestPrivolavacia) vchodNavest = 'stoj';
		if (vchodNavest === 'stoj') vchodNavestRychlost = null;
	});
	let trackWidth: number = $state(0);
	let navestidla: (HTMLDivElement | null)[] = $state([]);
	let vchodNavestElement: HTMLDivElement | null = $state(null);
	const boundaries = $derived.by(() => {
		trackWidth;
		const result = [
			...navestidla
				.filter((n) => n !== null && document.body.contains(n))
				.map((n) => n!.getBoundingClientRect().left + n!.getBoundingClientRect().width / 2)
		];
		if (vchodNavestElement !== null && document.body.contains(vchodNavestElement)) {
			result.push(
				vchodNavestElement.getBoundingClientRect().left +
					vchodNavestElement.getBoundingClientRect().width / 2
			);
		}
		return result;
	});

	let trainPositions: number[] = $state([]);
	let trainWidth: number[] = $state([]);
	let movingTrains: boolean[] = $state([]);
	let waitingTrains: boolean[] = $state([]);

	const oddiel: boolean[] = $derived.by(() => {
		const result = Array(pocetOddielov).fill(false);
		for (const i in trainPositions) {
			const left = trainPositions[i];
			const right = left + trainWidth[i];
			for (let i = 0; i < pocetOddielov; i++) {
				result[i] ||=
					(boundaries[i] < left && left < boundaries[i + 1]) ||
					(boundaries[i] < right && right < boundaries[i + 1]);
			}
		}
		return result;
	});

	setInterval(() => {
		for (let i = 0; i < trainPositions.length; i++) {
			if (movingTrains[i]) {
				const newPosition = trainPositions[i] + 1;
				// dont move into occupied section
				const nextSection = boundaries.findIndex((b) => b > trainPositions[i] + trainWidth[i]);
				if (nextSection === -1) {
					movingTrains[i] = false;
					waitingTrains[i] = false;
				} else if (newPosition + trainWidth[i] >= boundaries[nextSection] && oddiel[nextSection]) {
					waitingTrains[i] = true;
				} else {
					waitingTrains[i] = false;
					trainPositions[i] = newPosition;
				}
			}
		}
	}, 1000 / 60);

	function onresize(event: UIEvent) {
		const newWidth = document.getElementById('main')?.clientWidth ?? trackWidth;
		trainPositions = trainPositions.map((pos, i) => (pos / trackWidth) * newWidth);
	}
</script>

<svelte:window {onresize} />

{#if dev}
	{#each Array.from({ length: pocetOddielov }) as _, i}
		<div
			class="absolute top-0 flex h-10 bg-opacity-40 {oddiel[i]
				? 'bg-red-500'
				: 'bg-green-500'} border-x border-dotted border-black"
			style="left: {boundaries[i]}px; Width: {boundaries[i + 1] - boundaries[i]}px;"
		></div>
	{/each}
	{#each trainPositions as train, i}
		<div
			class="absolute top-0 flex h-10 items-center justify-center {waitingTrains[i]
				? 'animate-pulse bg-violet-500 bg-opacity-60'
				: 'bg-blue-500 bg-opacity-40'}"
			style="left: {train}px; width: {trainWidth[i]}px;"
		>
			{i}
		</div>
	{/each}
{/if}

<div class="flex flex-col justify-center overflow-hidden bg-green-200" id="main">
	<table cellspacing="0" cellpadding="0" class="h-min w-full">
		<tbody>
			<tr>
				<td>
					{#each trainPositions as trainpos, i}
						<div
							class="absolute top-0 z-10 w-[150%] -translate-y-1/3 transform {waitingTrains[i]
								? 'animate-pulse'
								: ''}"
							style="left: {trainpos}px;"
							bind:clientWidth={trainWidth[i]}
						>
							<img src="/track/train.svg" />
						</div>
					{/each}
				</td>
			</tr>
			<tr class="track" bind:clientWidth={trackWidth}>
				{#each Array.from({ length: tdCount }) as _}
					<td><img src="/track/straight_v.svg" /></td>
				{/each}
			</tr>
			<tr>
				<td colspan="3"></td>
				{#each Array.from({ length: pocetOddielov - 1 }) as _, i}
					<td
						><div class="navestidlo" bind:this={navestidla[i]}>
							<AutoblokNavestidlo
								navest={oddiel[i] ? 'stoj' : oddiel[i + 1] ? 'vystraha' : 'volno'}
							/>
						</div></td
					>
					<td colspan="4"></td>
				{/each}
				{#key pocetOddielov}
					<td
						><div class="navestidlo" bind:this={navestidla[pocetOddielov - 1]}>
							<AutoblokNavestidlo
								navest={oddiel[pocetOddielov - 1] ? 'stoj' : poslednyAutoblok}
								posledne={true}
							/>
						</div></td
					>
				{/key}
				<td colspan="3"></td>
				<td>
					<div class="navestidlo" bind:this={vchodNavestElement}>
						<VchodoveNavestidlo
							navest={vchodNavest}
							rychlost={vchodNavestRychlost}
							privolavacia={vchodNavestPrivolavacia}
						/>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<div>
		<label for="pocetOddielov">Počet oddielov:</label>
		<input type="range" min="4" max="10" step="1" bind:value={pocetOddielov} id="pocetOddielov" />
	</div>
	<div>
		<label for="vchodovehoNavestidlo">Návesť vchodového návestidla:</label>
		<select bind:value={vchodNavest} id="vchodovehoNavestidlo">
			{#each povoleneNavesti[TypNavestidla.HLAVNE_IBA_JAZDA] as navest}
				<option value={navest} disabled={navest !== 'stoj' && vchodNavestPrivolavacia}
					>{nazvyNavesti[navest]}</option
				>
			{/each}
		</select>
	</div>
	<div>
		<label for="vchodNavestRychlost">Rýchlosť vchodového návestidla:</label>
		<select
			bind:value={vchodNavestRychlost}
			id="vchodNavestRychlost"
			disabled={vchodNavest === 'stoj'}
		>
			<option value={null}>---</option>
			{#each [40, 60, 80, 100] as rychlost}
				<option value={rychlost}>{rychlost} km/h</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="vchodNavestPrivolavacia">Privolávacia návest:</label>
		<input type="checkbox" bind:checked={vchodNavestPrivolavacia} id="vchodNavestPrivolavacia" />
	</div>
	<div class="mt-5">
		<div class="flex justify-between text-3xl">
			<button
				onclick={() => {
					trainPositions.push(50);
				}}
			>
				<Icon icon="fa6-solid:plus" />
			</button>
			<img src="/track/train.svg" class="w-10" />
			<button
				onclick={() => {
					trainPositions.pop();
				}}
			>
				<Icon icon="fa6-solid:minus" />
			</button>
		</div>
		<div class="flex flex-col">
			{#each trainPositions as _, i}
				<div class="flex gap-1">
					<Icon
						onclick={() => (movingTrains[i] = !movingTrains[i])}
						icon={movingTrains[i] ? 'fa6-solid:pause' : 'fa6-solid:play'}
					/>
					<input
						type="range"
						min="0"
						max={trackWidth - trainWidth[i]}
						step="1"
						bind:value={trainPositions[i]}
					/>
				</div>
			{/each}
		</div>
	</div>
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>

<style lang="scss">
	.track {
		transform: perspective(1000px) rotateX(45deg);
	}

	td {
		position: relative;

		.navestidlo {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 20;
		}
	}
</style>
