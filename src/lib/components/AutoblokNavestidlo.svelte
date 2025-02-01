<script lang="ts">
	import {
		navestneZnaky,
		TypNavestidla,
		type AutoblokNavest,
		type Predzvest
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label,
		posledne = false
	}: { navest: AutoblokNavest | Predzvest | null; label?: string; posledne?: boolean } = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else
				znaky = options[TypNavestidla.AUTOBLOK] ??
					options[TypNavestidla.HLAVNE] ?? [null, null, null, null];
		} else znaky = [null, null, null, null];

		return znaky;
	});
</script>

<Navestidlo
	lightCount={3}
	activeLights={aktivneZnaky}
	speedIndication={false}
	{label}
	poleStyleClass="autoblok"
>
	{#snippet topSigns()}
		{#if posledne}
			<div
				class="absolute left-1/2 top-0 aspect-square w-[350%] -translate-x-1/2 transform border border-black bg-white"
			>
				<div
					class="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black"
				></div>
				<div
					class="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white"
				></div>
				<div
					class="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black"
				></div>
			</div>
		{/if}
	{/snippet}
</Navestidlo>
