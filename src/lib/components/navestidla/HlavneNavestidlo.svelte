<script lang="ts">
	import Skupina from './znacky/Skupina.svelte';
	import {
		getNavestneZnaky,
		isPredzvest,
		navestneZnaky,
		opakovanieNavesti,
		povolenaPrivolavacia,
		povoleneOpakovanie,
		privolavaciaNavest,
		TypNavestidla,
		type Additional,
		type HlavnaNavest,
		type PosunDovoleny,
		type Rychlost
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';
	import SkratenaVzdialenost from './znacky/SkratenaVzdialenost.svelte';

	let {
		navest,
		label,
		privolavacia = false,
		opakovanie = false,
		rychlost = null,
		additional = null
	}: {
		navest: HlavnaNavest | PosunDovoleny | null;
		label?: string;
		privolavacia?: boolean;
		opakovanie?: boolean;
		rychlost?: Rychlost | null;
		additional?: Additional | null;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = getNavestneZnaky(navest, TypNavestidla.HLAVNE);

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
		{#if additional === 'skupinove'}
			<Skupina />
		{:else if additional === 'skratena_vzd'}
			<SkratenaVzdialenost />
		{/if}
	{/snippet}
</Navestidlo>
