<script lang="ts">
	import { colors } from '$lib/consts';

	let {
		lightCount,
		activeLights,
		speedIndication = false,
		speed = undefined,
		label = undefined,
		poleStyleClass = '',
		labelStyleClass = poleStyleClass,
		topSigns = () => {},
		bottomSigns = () => {}
	}: {
		lightCount: number;
		activeLights: (string | null)[];
		speedIndication?: boolean;
		speed?: number | null;
		label?: string;
		poleStyleClass?: string;
		labelStyleClass?: string;
		topSigns?: () => any;
		bottomSigns?: () => any;
	} = $props();

	$effect(() => {
		if (speed !== undefined && !speedIndication) {
			console.warn('Speed indication is disabled, but speed is set.');
		}
		if (activeLights.length !== 0 && activeLights.length < lightCount) {
			console.warn('Light count is greater than supplied active lights.');
		}
	});
</script>

<div class="relative flex h-full w-full flex-col items-center">
	<div
		class="absolute top-0.5 z-10 flex w-full -translate-y-full transform flex-col justify-between rounded-full bg-stone-900 px-[15%] py-[20%]
		*:mb-[5%] *:mt-[5%] [&_*]:transition-colors [&_*]:duration-150"
	>
		{#each Array.from({ length: lightCount }) as _, i}
			<div class="aspect-square rounded-full {activeLights[i] || colors.blank}"></div>
		{/each}
		{#if speedIndication}
			<div class="aspect-square rounded-full {speed ? colors.yellow : colors.blank}"></div>
			<div class="-mt-0.5 mb-1 flex w-full flex-col justify-around">
				<div
					class="aspect-[6] {speed === 60
						? colors.yellow
						: [80, 100].includes(speed ?? -1)
							? colors.green
							: colors.blank}"
				></div>
				<div class="aspect-[7]"></div>
				<div class="aspect-[6] {speed === 100 ? colors.green : colors.blank}"></div>
			</div>
		{/if}
	</div>
	{#if label}
		<div class="label z-20 -mb-0.5 rounded-lg px-0.5 py-0.5 text-2xs font-bold {labelStyleClass}">
			{label}
		</div>
	{/if}
	<div class="pole relative h-full w-1/4 {poleStyleClass}">
		{@render topSigns()}
		<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
			{@render bottomSigns()}
		</div>
	</div>
</div>

<style lang="scss">
	.pole {
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
		outline: 1px solid black;
		border: 3px solid white;

		&.hlavne {
			background: #f00;
			color: #fff;
		}
		&.autoblok {
			background: #fff;
			color: #000;
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
