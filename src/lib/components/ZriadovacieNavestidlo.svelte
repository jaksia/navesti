<script lang="ts">
	import { navestneZnaky, TypNavestidla, type ZriadovaciaNavest } from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label
	}: {
		navest: ZriadovaciaNavest;
		label?: string;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else
				znaky = options[TypNavestidla.ZRIADOVACIE] ?? options[TypNavestidla.HLAVNE] ?? [null, null];
		} else znaky = [null, null];

		return znaky;
	});
</script>

<Navestidlo lightCount={2} activeLights={aktivneZnaky} {label} poleStyleClass="zriadovacie"
></Navestidlo>
