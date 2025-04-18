<script lang="ts">
	import { dev } from '$app/environment';
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import AutoblokNavestidlo from '$lib/components/navestidla/AutoblokNavestidlo.svelte';
	import HlavneNavestidlo from '$lib/components/navestidla/HlavneNavestidlo.svelte';
	import type { HlavnaNavest, Rychlost } from '$lib/types/navestidlo';
	import { nazvyNavesti, typeOptions, TypNavestidla } from '$lib/consts/navestidlo';
	import Icon from '@iconify/svelte';
	import { Tween } from 'svelte/motion';

	const MIN_FREE_TIME = 200;
	const MIN_TRAIN_STOP_TIME = 300;

	let trackNumber = $state(Math.round(Math.random()) + 1);
	let firstHectometer = $state(Math.floor(Math.random() * 150) + 200);
	let hectometerInterval = $state(Math.floor(Math.random() * 100) + 100);

	let vchodNavest: HlavnaNavest = $state('stoj');
	let vchodNavestRychlost: Rychlost | null = $state(null);
	let vchodNavestPrivolavacia = $state(false);
	let pocetOddielov = $state(4);
	const tdCount = $derived(3 + (pocetOddielov - 1) * 5 + 5);

	const poslednyAutoblok = $derived.by(() => {
		if (vchodNavest === 'stoj' || behindVchod) return 'vystraha';
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
	let trainSpeeds: Tween<number>[] = $state([]);
	let trainWidth: number[] = $state([]);
	let movingTrains: boolean[] = $state([]);
	let waitingTrains: (number | null)[] = $state([]);

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
	const behindVchod = $derived.by(() => {
		const lastBoundary = boundaries[boundaries.length - 1];
		return trainPositions.some((pos, i) => pos > lastBoundary - trainWidth[i] + 2);
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

	let lastWaitingTrains: (number | null)[] = [];
	let waitingTrainsChangeTime: number[] = $state([]);

	let now = $state(Date.now());
	let screenWidth = $state(0);
	let baseSpeed = $derived(screenWidth / 1700);

	setInterval(() => {
		now = Date.now();

		for (let i = 0; i < trainPositions.length; i++) {
			if (movingTrains[i]) {
				const speedUnit = baseSpeed * (trainSpeeds[i].current ?? 1);
				const nextSection = boundaries.findIndex((b) => b > trainPositions[i] + trainWidth[i]);
				const isBehindVchod =
					trainPositions[i] > boundaries[boundaries.length - 1] - trainWidth[i] + 2;

				if (trainPositions[i] + trainWidth[i] >= screenWidth) {
					movingTrains[i] = false;
					waitingTrains[i] = null;
				} else if (nextSection === -1) {
					if ((behindVchod && !isBehindVchod) || vchodNavest == 'stoj') {
						waitingTrains[i] = -1;
					} else {
						waitingTrains[i] = null;
						trainPositions[i] = trainPositions[i] + speedUnit;
					}
				} else if (
					trainPositions[i] + speedUnit * 3 + trainWidth[i] >= boundaries[nextSection] &&
					(oddiel[nextSection] ||
						now - oddielChangeTime[nextSection] <= MIN_FREE_TIME ||
						(waitingTrains[i] == nextSection &&
							now - waitingTrainsChangeTime[i] <= MIN_TRAIN_STOP_TIME) ||
						waitingTrains.some((w, j) => j < i && w === nextSection))
				) {
					// Only continue if the next section is free for more than MIN_FREE_TIME and there is no other train waiting to enter it
					// If the train stopped, it has to be stopped for at least MIN_TRAIN_STOP_TIME
					// Of all the trains waiting to enter the next section, the first one has priority
					waitingTrains[i] = nextSection;
				} else {
					waitingTrains[i] = null;
					trainPositions[i] = trainPositions[i] + speedUnit;
				}
				if (waitingTrains[i] !== lastWaitingTrains[i]) waitingTrainsChangeTime[i] = now;
				lastWaitingTrains[i] = waitingTrains[i];
			}
		}
	}, 1000 / 60);

	function onresize(event: UIEvent) {
		const newWidth = document.getElementById('main')?.clientWidth ?? trackWidth;
		trainPositions = trainPositions.map((pos, i) => (pos / trackWidth) * newWidth);
	}

	function addTrain() {
		trainPositions.push(50);
		trainSpeeds.push(new Tween(1));
		movingTrains.push(false);
		waitingTrains.push(null);
	}

	function removeTrain() {
		trainPositions.pop();
		trainSpeeds.pop();
		movingTrains.pop();
		waitingTrains.pop();
	}

	let dragTrain: number | null = null;

	function ondragover(event: DragEvent) {
		event.preventDefault();
		movingTrains[dragTrain ?? -1] = false;
		trainPositions[dragTrain ?? -1] = event.clientX - trainWidth[dragTrain ?? -1] / 2;
	}

	function ondrop(event: DragEvent) {
		event.preventDefault();
		dragTrain = null;
	}
</script>

<svelte:head>
	<title>Autoblok</title>
</svelte:head>
<svelte:window {onresize} />
<svelte:body {ondragover} {ondrop} />

<DayNight class="flex" --ground="30%">
	<div class="flex overflow-hidden" id="main" bind:clientWidth={screenWidth}>
		{#if dev}
			{#each Array.from({ length: pocetOddielov }) as _, i}
				{@const timeDiff = now - oddielChangeTime[i]}
				<div
					class={[
						'absolute bottom-0 flex h-10 border-x border-dotted border-black',
						oddiel[i]
							? 'bg-red-500/40'
							: now - oddielChangeTime[i] <= MIN_FREE_TIME
								? 'bg-yellow-500/40'
								: 'bg-green-500/40'
					]}
					style="left: {boundaries[i]}px; Width: {boundaries[i + 1] - boundaries[i]}px;"
				>
					{Math.floor(timeDiff / 60000)}:{Math.floor((timeDiff % 60000) / 1000)
						.toString()
						.padStart(2, '0')}.{(timeDiff % 1000).toString().padStart(3, '0')}
				</div>
			{/each}
			<div
				class={[
					'absolute bottom-0 flex h-10 border-x border-dotted border-black',
					behindVchod ? 'bg-red-500/40' : 'bg-green-500/40'
				]}
				style="left: {boundaries[boundaries.length - 1]}px; width: {screenWidth -
					boundaries[boundaries.length - 1]}px;"
			></div>
			{#each trainPositions as train, i}
				{@const timeDiff = now - waitingTrainsChangeTime[i]}
				<div
					class={[
						'absolute bottom-0 flex h-10 flex-col items-center justify-center text-sm',
						waitingTrains[i] !== null ? 'animate-pulse bg-violet-500/60' : 'bg-blue-500/40'
					]}
					style="left: {train}px; width: {trainWidth[i]}px;"
				>
					<span>{i}</span>
					<span
						>{Math.floor(timeDiff / 60000)}:{Math.floor((timeDiff % 60000) / 1000)
							.toString()
							.padStart(2, '0')}.{(timeDiff % 1000).toString().padStart(3, '0')}</span
					>
				</div>
			{/each}
		{/if}

		<table cellspacing="0" cellpadding="0" class="mt-auto mb-[25%] w-full">
			<tbody>
				<tr>
					<td>
						{#each trainPositions as trainpos, i}
							<div
								class={[
									'absolute top-0 z-10 w-[150%] -translate-y-1/3',
									waitingTrains[i] !== null ? 'animate-pulse' : ''
								]}
								style="left: {trainpos}px;"
								bind:clientWidth={trainWidth[i]}
							>
								<img
									src="/track/train.svg"
									alt="Train"
									draggable="true"
									ondragstart={() => (dragTrain = i)}
								/>
							</div>
						{/each}
					</td>
				</tr>
				<tr class="track" bind:clientWidth={trackWidth}>
					{#each Array.from({ length: tdCount }) as _}
						<td><img src="/track/straight_v.svg" alt="Track" draggable="false" /></td>
					{/each}
				</tr>
				<tr>
					<td colspan="3"></td>
					{#each Array.from({ length: pocetOddielov - 1 }) as _, i}
						<td
							><div class="navestidlo aspect-1/3 w-1/2" bind:this={navestidla[i]}>
								<AutoblokNavestidlo
									navest={oddiel[i] ? 'stoj' : oddiel[i + 1] ? 'vystraha' : 'volno'}
									label={trackNumber + '-' + (firstHectometer + i * hectometerInterval)}
								/>
							</div></td
						>
						<td colspan="4"></td>
					{/each}
					{#key pocetOddielov}
						<td
							><div class="navestidlo aspect-1/3 w-1/2" bind:this={navestidla[pocetOddielov - 1]}>
								<AutoblokNavestidlo
									navest={oddiel[pocetOddielov - 1] ? 'stoj' : poslednyAutoblok}
									posledne={true}
									label={trackNumber +
										'-' +
										(firstHectometer + (pocetOddielov - 1) * hectometerInterval)}
								/>
							</div></td
						>
					{/key}
					<td colspan="3"></td>
					<td>
						<div class="navestidlo aspect-1/3 w-1/2" bind:this={vchodNavestElement}>
							<HlavneNavestidlo
								iba_jazda={true}
								navest={behindVchod ? 'stoj' : vchodNavest}
								rychlost={vchodNavestRychlost}
								privolavacia={vchodNavestPrivolavacia}
								label={trackNumber + (Math.random() > 0.5 ? 'S' : 'L')}
							/>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />

	<fieldset class="fieldset border-base-300 rounded-box bg-base-200 border p-2">
		<legend class="fieldset-legend">Počet oddielov</legend>
		<input
			type="range"
			min="4"
			max="10"
			step="1"
			bind:value={pocetOddielov}
			class="range range-neutral"
		/>
	</fieldset>
	<label for="vchodovehoNavestidlo" class="floating-label">
		<span>Návesť vchodového návestidla</span>
		<select bind:value={vchodNavest} id="vchodovehoNavestidlo" class="select">
			{#each typeOptions[TypNavestidla.HLAVNE_IBA_JAZDA].allowedSignals as navest}
				<option value={navest} disabled={navest !== 'stoj' && vchodNavestPrivolavacia}
					>{nazvyNavesti[navest]}</option
				>
			{/each}
		</select>
	</label>
	<label for="vchodNavestRychlost" class="floating-label">
		<span>Rýchlosť vchodového návestidla</span>
		<select
			bind:value={vchodNavestRychlost}
			id="vchodNavestRychlost"
			disabled={vchodNavest === 'stoj'}
			class="select"
		>
			<option value={null}>---</option>
			{#each [40, 60, 80, 100] as rychlost}
				<option value={rychlost}>{rychlost} km/h</option>
			{/each}
		</select>
	</label>
	<label for="vchodNavestPrivolavacia" class="n-label">
		<input
			type="checkbox"
			bind:checked={vchodNavestPrivolavacia}
			id="vchodNavestPrivolavacia"
			class="checkbox"
		/>
		Privolávacia návest
	</label>
	<div class="mt-5">
		<div class="flex justify-between text-3xl">
			<button onclick={addTrain} class="cursor-pointer">
				<Icon icon="fa6-solid:plus" />
			</button>
			<img src="/track/train.svg" class="w-12" alt="Train" />
			<button onclick={removeTrain} class="cursor-pointer">
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
							class="size-4 cursor-pointer"
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
							bind:value={trainSpeeds[i].target}
						/>
						<span class="w-2/12 text-right">{trainSpeeds[i].target ?? 1}x</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<a href="/" class="mt-auto font-bold underline">Naspäť</a>
</div>

<style lang="scss">
	.track {
		transform: perspective(500px) rotateX(45deg);
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
