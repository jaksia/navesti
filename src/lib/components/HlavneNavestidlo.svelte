<script lang="ts">
	import {
		isPredzvest,
		navestneZnaky,
		opakovanieNavesti,
		povolenaPrivolavacia,
		povoleneOpakovanie,
		privolavaciaNavest,
		TypNavestidla,
		type HlavnaNavest,
		type PosunDovoleny,
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
		navest: HlavnaNavest | PosunDovoleny | null;
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
	$inspect(aktivneZnaky);
</script>

<Navestidlo
	lightCount={4}
	activeLights={aktivneZnaky}
	speedIndication={true}
	speed={navest && (isPredzvest(navest) || navest === 'volno') ? rychlost : null}
	{label}
	poleStyleClass="hlavne"
>
	{#snippet topSigns()}
		<div class="absolute left-1/2 top-0 w-[200%] -translate-x-1/2">
			<svg class="aspect-square w-full transform items-center" viewBox="0 0 100 100">
				<rect x="0" y="0" width="100" height="100" stroke="black" stroke-width="15" fill="white"
				></rect>
				<path d="M 100 0 L 0 100" stroke="black" stroke-width="10" />
			</svg>
		</div>
	{/snippet}
</Navestidlo>
