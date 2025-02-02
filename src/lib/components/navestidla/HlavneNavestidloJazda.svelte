<script lang="ts">
	import {
		getNavestneZnaky,
		opakovanieNavesti,
		povolenaPrivolavacia,
		povoleneOpakovanie,
		privolavaciaNavest,
		TypNavestidla,
		type Additional,
		type HlavnaNavest,
		type Rychlost
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';
	import SkratenaVzdialenost from './znacky/SkratenaVzdialenost.svelte';
	import Skupina from './znacky/Skupina.svelte';

	let {
		navest,
		label,
		privolavacia = false,
		opakovanie = false,
		rychlost = null,
		additional = null
	}: {
		navest: HlavnaNavest | null;
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
</script>

<Navestidlo
	lightCount={4}
	activeLights={aktivneZnaky}
	speedIndication={true}
	speed={rychlost}
	{label}
	poleStyleClass="hlavne_jazda"
	labelStyleClass="hlavne"
>
	{#snippet topSigns()}
		{#if additional === 'skupinove'}
			<Skupina />
		{:else if additional === 'skratena_vzd'}
			<SkratenaVzdialenost />
		{/if}
	{/snippet}
</Navestidlo>
