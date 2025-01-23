<script lang="ts">
	import {
		navestneZnaky,
		privolavaciaNavest,
		TypNavestidla,
		type AutoblokNavest,
		type HlavnaNavest,
		type Rychlost
	} from './navestidlo';

	let {
		navest,
		label,
		privolavacia = false,
		rychlost = null
	}: {
		navest: HlavnaNavest;
		label?: string;
		privolavacia?: boolean;
		rychlost?: Rychlost | null;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else
				znaky = options[TypNavestidla.AUTOBLOK] ??
					options[TypNavestidla.HLAVNE] ?? [null, null, null, null];
		} else znaky = [null, null, null, null];

		if (privolavacia) znaky = znaky.map((znak, i) => znak ?? '' + (privolavaciaNavest[i] ?? ''));
		return znaky;
	});
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-col items-center justify-between gap-1 rounded-full bg-stone-900 px-1 py-2">
		{#each Array.from({ length: 4 }) as _, i}
			<div class="h-3 w-3 rounded-full {aktivneZnaky[i] || 'bg-stone-800'}"></div>
		{/each}
		<div class="h-3 w-3 rounded-full {rychlost ? 'bg-yellow-400' : 'bg-stone-800'}"></div>
		<div class="flex h-2 w-3 flex-col justify-center gap-0.5">
			<div
				class="h-0.5 {rychlost === 60
					? 'bg-yellow-400'
					: [80, 100].includes(rychlost ?? -1)
						? 'bg-green-600'
						: 'bg-stone-800'}"
			></div>
			<div class="h-0.5 {rychlost === 100 ? 'bg-green-600' : 'bg-stone-800'}"></div>
		</div>
	</div>
	{#if label}
		<div class="label z-10 -mb-0.5 rounded-lg px-0.5 py-0.5 text-2xs font-bold">
			{label}
		</div>
	{/if}
	<div class="pole relative h-16 w-1.5"></div>
</div>

<style lang="scss">
	.label {
		outline: 0.5px solid black;
		border: 2px solid white;

		background: #fff;
		color: #000;
	}
	.pole {
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
</style>
