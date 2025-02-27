<script lang="ts">
	import { colors } from '$lib/consts';

	let {
		lightCount = 0,
		activeLights = [],
		speedIndication = false,
		speed = undefined,
		label = undefined,
		poleStyleClass = '',
		labelStyleClass = poleStyleClass,
		topSigns = () => {},
		bottomSigns = () => {},
		renderLights
	}: {
		lightCount?: number;
		activeLights?: (string | null)[];
		speedIndication?: boolean;
		speed?: number | null;
		label?: string;
		poleStyleClass?: string;
		labelStyleClass?: string;
		topSigns?: () => any;
		bottomSigns?: () => any;
		renderLights?: () => any;
	} = $props();

	$effect(() => {
		if (speed !== undefined && !speedIndication) {
			console.warn('Speed indication is disabled, but speed is set.');
		}
		if (activeLights.length !== 0 && activeLights.length < lightCount) {
			console.warn('Light count is greater than supplied active lights.');
		}
	});

	let labelHeight = $state(0);
	let labelSpacerHeight = $state(0);
</script>

<div class="relative flex h-full w-full flex-col items-center">
	<div
		class="absolute top-0.5 z-10 flex w-full -translate-y-full flex-col justify-between rounded-full bg-stone-900 px-[15%] py-[15%]
		*:mt-[6%] *:mb-[6%] **:transition-all **:duration-300"
	>
		{#if renderLights}
			{@render renderLights()}
		{:else}
			{#each Array.from({ length: lightCount }) as _, i}
				<div class="light aspect-square rounded-full {activeLights[i] || colors.blank}"></div>
			{/each}
			{#if speedIndication}
				<div class="light aspect-square rounded-full {speed ? colors.yellow : colors.blank}"></div>
				<div
					class="light !m-0 aspect-[6] {speed === 60
						? colors.yellow
						: [80, 100].includes(speed ?? -1)
							? colors.green
							: colors.blank}"
				></div>
				<div class="!m-0 aspect-[7]"></div>
				<div class="light !m-0 aspect-[6] {speed === 100 ? colors.green : colors.blank}"></div>
				<div></div>
			{/if}
		{/if}
		{#if label}
			<div
				class="absolute bottom-0 left-1/2 -z-10 aspect-square w-1/4 -translate-x-1/2 translate-y-full"
			>
				<div
					class="label rounded-lg font-bold {labelStyleClass}"
					bind:clientHeight={labelHeight}
					style="font-size: {labelHeight * 0.7}px;
						   line-height: {labelHeight * 0.85}px;
						   {labelHeight <= 20 ? 'border-width: 2px;' : ''}
						   min-width: {label.length + 2}ch;"
				>
					{label}
				</div>
			</div>
		{/if}
	</div>
	{#if label}
		<div class="relative aspect-square w-1/4" bind:clientHeight={labelSpacerHeight}></div>
	{/if}
	<div class="pole relative -z-10 h-full w-1/4 {poleStyleClass}">
		<div
			class="signs absolute left-1/2 w-full"
			style="top: {label
				? `calc(${labelHeight - labelSpacerHeight}px + var(--label-outline-size) + var(--label-border-size))`
				: '0'}"
		>
			{@render topSigns()}
		</div>
		<div class="signs absolute bottom-0 left-1/2 -translate-x-1/2">
			{@render bottomSigns()}
		</div>
	</div>
</div>

<style lang="scss">
	.label,
	.signs {
		--label-outline-size: 1px;
		--label-border-size: 3px;
	}

	.pole {
		position: relative;
		background: gray;
		&.hlavne {
			background-image: linear-gradient(
				to bottom,
				#f00 25%,
				#fff 25%,
				#fff 37.5%,
				#f00 37.5%,
				#f00 62.5%,
				#fff 62.5%,
				#fff 75%,
				#f00 75%
			);
		}
		&.hlavne_jazda {
			background-image: linear-gradient(
				to bottom,
				#fff 25%,
				#f00 25%,
				#f00 50%,
				#fff 50%,
				#fff 75%,
				#f00 75%
			);
		}
		&.vlozene {
			background-image: linear-gradient(
				to bottom,
				#fff 16%,
				#00f 16%,
				#00f 33%,
				#f00 33%,
				#f00 50%,
				#fff 50%,
				#fff 66%,
				#f00 66%,
				#f00 83%,
				#00f 83%
			);
		}
		&.autoblok {
			background: white;
		}
		&.zriadovacie {
			background-image: linear-gradient(
				to bottom,
				#00f 25%,
				#fff 25%,
				#fff 50%,
				#00f 50%,
				#00f 75%,
				#fff 75%
			);
		}
	}
	.label {
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		height: 175%;
		min-height: 15px;

		padding: 5% 25%;
		text-align: center;

		outline: var(--label-outline-size) solid black;
		border: var(--label-border-size) solid white;
		font-weight: bold;

		background: #fff;
		color: #000;

		&.hlavne {
			background: #f00;
			color: #fff;
		}
		&.zriadovacie {
			background: #00f;
			color: #fff;
		}
		&.predzvest {
			background: black;
			color: #fff;
		}
	}
</style>
