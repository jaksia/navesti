<script lang="ts">
	import PoslednyAutoblok from './signs/PoslednyAutoblok.svelte';

	import type { AllowedSignals } from '$lib/types/navestidlo';
	import Navestidlo, { type DisplayMode } from './Navestidlo.svelte';
	import { generateLabel } from '$lib/labels';
	import { getNavestneZnaky, TypNavestidla } from '$lib/consts/navestidlo';

	let {
		navest,
		label,
		posledne = false,
		displayMode,
		letters
	}: {
		navest: AllowedSignals[TypNavestidla.AUTOBLOK] | null;
		label?: string;
		posledne?: boolean;
		displayMode?: DisplayMode;
		letters?: { [key: string]: boolean };
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.AUTOBLOK));
</script>

<Navestidlo
	lightCount={3}
	activeLights={aktivneZnaky}
	speedIndication={false}
	label={label ?? generateLabel('autoblok')}
	poleStyleClass="autoblok"
	{displayMode}
	{letters}
>
	{#snippet topSigns()}
		{#if posledne}
			<PoslednyAutoblok />
		{/if}
	{/snippet}
</Navestidlo>
