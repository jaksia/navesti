<script lang="ts">
	import PoslednyAutoblok from './znacky/PoslednyAutoblok.svelte';

	import { getNavestneZnaky, TypNavestidla, type AllowedSignals } from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';
	import { generateLabel } from '$lib/labels';

	let {
		navest,
		label,
		posledne = false
	}: {
		navest: AllowedSignals[TypNavestidla.AUTOBLOK] | null;
		label?: string;
		posledne?: boolean;
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.AUTOBLOK));
</script>

<Navestidlo
	lightCount={3}
	activeLights={aktivneZnaky}
	speedIndication={false}
	label={label ?? generateLabel('autoblok')}
	poleStyleClass="autoblok"
>
	{#snippet topSigns()}
		{#if posledne}
			<PoslednyAutoblok />
		{/if}
	{/snippet}
</Navestidlo>
