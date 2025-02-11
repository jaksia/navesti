<script lang="ts">
	import PredzvestBezVyhybiek from './znacky/PredzvestBezVyhybiek.svelte';

	import { colors } from '$lib/consts';
	import {
		getNavestneZnaky,
		TypNavestidla,
		type Additional,
		type AllowedSignals
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';
	import PredzvestVyhybky from './znacky/PredzvestVyhybky.svelte';
	import SkratenaVzdialenost from './znacky/SkratenaVzdialenost.svelte';
	import { generateLabel } from '$lib/labels';

	let {
		navest,
		label,
		repeating = false,
		kryjeVyhybky = false,
		additional = null
	}: {
		navest: AllowedSignals[TypNavestidla.PREDZVEST] | null;
		label?: string;
		repeating?: boolean;
		kryjeVyhybky?: boolean;
		additional?: Additional | null;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = getNavestneZnaky(navest, TypNavestidla.PREDZVEST);

		if (repeating) znaky = znaky.map((znak, i) => (i === 2 ? colors.white : znak)); // Setting directly would affect navestneZnaky
		return znaky;
	});

	function generate(repeating: boolean) {
		let type = ['vchod', 'odchod', 'oddiel', 'krycie'][Math.floor(Math.random() * 4)];
		return generateLabel('predzvest', {
			group: Math.random() < 0.25,
			nextType: type as any,
			repeating
		});
	}
</script>

<Navestidlo
	lightCount={repeating ? 3 : 2}
	activeLights={aktivneZnaky}
	label={label ?? generate(repeating)}
	poleStyleClass="predzvest"
>
	{#snippet topSigns()}
		{#if additional === 'skratena_vzd'}
			<SkratenaVzdialenost />
		{/if}
	{/snippet}
	{#snippet bottomSigns()}
		{#if kryjeVyhybky}
			<PredzvestVyhybky />
		{:else}
			<PredzvestBezVyhybiek />
		{/if}
	{/snippet}
</Navestidlo>
