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

	const MIN_FREE_TIME = 500;

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
	let trainSpeeds: number[] = $state([]);
	let trainWidth: number[] = $state([]);
	let movingTrains: boolean[] = $state([]);
	let waitingTrains: (number | undefined)[] = $state([]);

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

	let lastOddiel: boolean[] = [];
	let lastOddielChangeTime: number[] = [];
	let oddielChangeTime: number[] = $derived.by(() => {
		const result = oddiel.map((o, i) => {
			if (o !== lastOddiel[i]) {
				lastOddielChangeTime[i] = Date.now();
			}
			return lastOddielChangeTime[i];
		});
		lastOddiel = oddiel;
		return result;
	});

	let now = $state(Date.now());

	setInterval(() => {
		now = Date.now();

		for (let i = 0; i < trainPositions.length; i++) {
			if (movingTrains[i]) {
				const speedUnit = trainSpeeds[i] ?? 1;
				const nextSection = boundaries.findIndex((b) => b > trainPositions[i] + trainWidth[i]);
				if (nextSection === -1) {
					movingTrains[i] = false;
					waitingTrains[i] = undefined;
				} else if (
					trainPositions[i] + speedUnit * 3 + trainWidth[i] >= boundaries[nextSection] &&
					(oddiel[nextSection] ||
						now - oddielChangeTime[nextSection] <= MIN_FREE_TIME ||
						waitingTrains.some((w, j) => j < i && w === nextSection))
				) {
					// Only continue if the next section is free for more than MIN_FREE_TIME and there is no other train waiting to enter it
					// Of all the trains waiting to enter the next section, the first one has priority
					waitingTrains[i] = nextSection;
				} else {
					waitingTrains[i] = undefined;
					trainPositions[i] = trainPositions[i] + speedUnit;
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
		{@const timeDiff = now - oddielChangeTime[i]}
		<div
			class="absolute top-0 flex h-10 bg-opacity-40 {oddiel[i]
				? 'bg-red-500'
				: now - oddielChangeTime[i] <= MIN_FREE_TIME
					? 'bg-yellow-500'
					: 'bg-green-500'}
				border-x border-dotted border-black"
			style="left: {boundaries[i]}px; Width: {boundaries[i + 1] - boundaries[i]}px;"
		>
			{Math.floor(timeDiff / 60000)}:{Math.floor((timeDiff % 60000) / 1000)
				.toString()
				.padStart(2, '0')}.{(timeDiff % 1000).toString().padStart(3, '0')}
		</div>
	{/each}
	{#each trainPositions as train, i}
		<div
			class="absolute top-0 flex h-10 items-center justify-center {waitingTrains[i] !== undefined
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
							class="absolute top-0 z-10 w-[150%] -translate-y-1/3 transform {waitingTrains[i] !==
							undefined
								? 'animate-pulse'
								: ''}"
							style="left: {trainpos}px;"
							bind:clientWidth={trainWidth[i]}
						>
							<img src="/track/train.svg" alt="Train" />
						</div>
					{/each}
				</td>
			</tr>
			<tr class="track" bind:clientWidth={trackWidth}>
				{#each Array.from({ length: tdCount }) as _}
					<td><img src="/track/straight_v.svg" alt="Track" /></td>
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
			<img src="/track/train.svg" class="w-10" alt="Train" />
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
				<div class="mt-2 flex flex-col items-center">
					<div class="flex gap-1">
						<Icon
							onclick={() => (movingTrains[i] = !movingTrains[i])}
							icon={movingTrains[i] ? 'fa6-solid:pause' : 'fa6-solid:play'}
							class="h-4 w-4 cursor-pointer"
						/>
						<input
							type="range"
							class="w-full"
							min="0"
							max={trackWidth - trainWidth[i]}
							step="1"
							bind:value={trainPositions[i]}
						/>
					</div>
					<!-- smaller speed slider, values from .5 to 5 -->
					<div class="flex w-3/5 justify-between">
						<input
							type="range"
							min=".5"
							max="5"
							step=".5"
							defaultValue="1"
							class="w-9/12"
							bind:value={trainSpeeds[i]}
						/>
						<span class="w-2/12 text-right">{trainSpeeds[i] ?? 1}x</span>
					</div>
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
