<script lang="ts">
	import { navestneZnaky, TypNavestidla, type VlozenaNavest } from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label
	}: {
		navest: VlozenaNavest;
		label?: string;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else
				znaky = options[TypNavestidla.VLOZENE] ??
					options[TypNavestidla.HLAVNE] ?? [null, null, null];
		} else znaky = [null, null, null];

		return znaky;
	});
</script>

<Navestidlo lightCount={3} activeLights={aktivneZnaky} {label} poleStyleClass="vlozene"
></Navestidlo>
