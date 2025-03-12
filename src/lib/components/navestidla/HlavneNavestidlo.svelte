<script lang="ts">
	import Skupina from './signs/Skupina.svelte';
	import {
		getNavestneZnaky,
		isPredzvest,
		opakovanieNavesti,
		povolenaPrivolavacia,
		povoleneOpakovanie,
		privolavaciaNavest,
		TypNavestidla,
		type Additional,
		type AllowedSignals,
		type Rychlost
	} from '$lib/navestidlo';
	import Navestidlo, { type DisplayMode } from './Navestidlo.svelte';
	import SkratenaVzdialenost from './signs/SkratenaVzdialenost.svelte';
	import { generateLabel } from '$lib/labels';

	let {
		iba_jazda = false,
		navest,
		label,
		privolavacia = false,
		opakovanie = false,
		rychlost = null,
		additional = null,
		displayMode,
		letters
	}: {
		iba_jazda?: boolean;
		navest:
			| AllowedSignals[TypNavestidla.HLAVNE_IBA_JAZDA]
			| AllowedSignals[TypNavestidla.HLAVNE]
			| null;
		label?: string;
		privolavacia?: boolean;
		opakovanie?: boolean;
		rychlost?: Rychlost | null;
		additional?: Additional | null;
		displayMode?: DisplayMode;
		letters?: { [key: string]: boolean };
	} = $props();

	const type = $derived(iba_jazda ? TypNavestidla.HLAVNE_IBA_JAZDA : TypNavestidla.HLAVNE);

	const aktivneZnaky = $derived.by(() => {
		if (type === TypNavestidla.HLAVNE_IBA_JAZDA && navest === 'p_dovoleny') return [];
		let znaky: (string | null)[] = getNavestneZnaky(navest, type);

		if (privolavacia && povolenaPrivolavacia.includes(navest))
			znaky = znaky.map((znak, i) => znak ?? '' + (privolavaciaNavest[i] ?? ''));
		if (opakovanie && povoleneOpakovanie.includes(navest))
			znaky = znaky.map((znak, i) => znak ?? '' + (opakovanieNavesti[i] ?? ''));
		return znaky;
	});

	function generate(additional: Additional | null) {
		let type =
			additional === 'skupinove'
				? 'odchod'
				: ['vchod', 'odchod', 'oddiel', 'krycie'][Math.floor(Math.random() * 4)];
		return generateLabel(type as any, { group: additional === 'skupinove' });
	}
</script>

<Navestidlo
	lightCount={4}
	activeLights={aktivneZnaky}
	speedIndication={true}
	speed={navest && isPredzvest(navest) ? rychlost : null}
	label={label ?? generate(additional)}
	poleStyleClass="hlavne{iba_jazda ? '_jazda' : ''}"
	labelStyleClass="hlavne"
	{displayMode}
	{letters}
>
	{#snippet topSigns()}
		{#if additional === 'skupinove'}
			<Skupina />
		{:else if additional === 'skratena_vzd'}
			<SkratenaVzdialenost />
		{/if}
	{/snippet}
</Navestidlo>
