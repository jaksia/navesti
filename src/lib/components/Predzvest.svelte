<script lang="ts">
	import { colors } from '$lib/consts';
	import {
		navestneZnaky,
		povoleneOpakovanie,
		TypNavestidla,
		type Predzvest,
		type Volno
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label,
		repeating = false,
		kryjeVyhybky = false
	}: {
		navest: Predzvest | Volno | null;
		label?: string;
		repeating?: boolean;
		kryjeVyhybky?: boolean;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else
				znaky = options[TypNavestidla.PREDZVEST] ??
					options[TypNavestidla.HLAVNE] ?? [null, null, null];
		} else znaky = [null, null, null];

		if (repeating && povoleneOpakovanie.includes(navest))
			znaky = znaky.map((znak, i) => (i === 2 ? colors.white : znak)); // Setting directly would affect navestneZnaky
		return znaky;
	});
</script>

<Navestidlo
	lightCount={repeating ? 3 : 2}
	activeLights={aktivneZnaky}
	{label}
	poleStyleClass="predzvest"
>
	{#snippet bottomSigns()}
		<div class="aspect-[0.8] h-36 overflow-hidden border-8 border-black bg-white">
			{#if kryjeVyhybky}
				<svg
					class="absolute left-0 top-0 h-full w-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
				>
					<path
						d="M 0 0 L 50 45 L 100 0 M 0 100 L 50 55 L 100 100"
						stroke="black"
						stroke-width="12"
						fill="none"
					></path>
				</svg>
			{:else}
				<div
					class="absolute left-1/2 top-0 h-full -translate-x-1/2 transform border-x-8 border-black"
				></div>
				<div
					class="absolute left-0 top-1/2 w-full -translate-y-1/2 transform border-y-8 border-black"
				></div>
			{/if}
		</div>
	{/snippet}
</Navestidlo>
