<script lang="ts">
	import { generateLabel } from '$lib/labels';
	import type { AllowedSignals } from '$lib/types/navestidlo';
	import { getNavestneZnaky, TypNavestidla } from '$lib/consts/navestidlo';
	import Navestidlo, { type DisplayMode } from './Navestidlo.svelte';

	let {
		navest,
		label,
		displayMode,
		letters
	}: {
		navest: AllowedSignals[TypNavestidla.VLOZENE] | null;
		label?: string;
		displayMode?: DisplayMode;
		letters?: { [key: string]: boolean };
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.VLOZENE));
</script>

<Navestidlo
	lightCount={3}
	activeLights={aktivneZnaky}
	label={label ?? generateLabel('vlozene')}
	poleStyleClass="vlozene"
	labelStyleClass="hlavne"
	{displayMode}
	{letters}
></Navestidlo>
