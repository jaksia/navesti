<script lang="ts">
	import {
		navestneZnaky,
		opakovanieNavesti,
		povolenaPrivolavacia,
		povoleneOpakovanie,
		privolavaciaNavest,
		typeOptions,
		TypNavestidla,
		type HlavnaNavest,
		type Rychlost
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label,
		privolavacia = false,
		opakovanie = false,
		rychlost = null
	}: {
		navest: HlavnaNavest | null;
		label?: string;
		privolavacia?: boolean;
		opakovanie?: boolean;
		rychlost?: Rychlost | null;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else znaky = options[TypNavestidla.HLAVNE] ?? [null, null, null, null];
		} else znaky = [null, null, null, null];

		if (privolavacia && povolenaPrivolavacia.includes(navest))
			znaky = znaky.map((znak, i) => znak ?? '' + (privolavaciaNavest[i] ?? ''));
		if (opakovanie && povoleneOpakovanie.includes(navest))
			znaky = znaky.map((znak, i) => znak ?? '' + (opakovanieNavesti[i] ?? ''));
		return znaky;
	});
</script>

<Navestidlo
	lightCount={4}
	activeLights={aktivneZnaky}
	speedIndication={true}
	speed={rychlost}
	{label}
	poleStyleClass="hlavne_jazda"
	labelStyleClass="hlavne"
></Navestidlo>
