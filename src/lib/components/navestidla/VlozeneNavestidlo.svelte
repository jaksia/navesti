<script lang="ts">
	import { generateLabel } from '$lib/labels';
	import { getNavestneZnaky, TypNavestidla, type AllowedSignals } from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label
	}: {
		navest: AllowedSignals[TypNavestidla.VLOZENE] | null;
		label?: string;
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.VLOZENE));
</script>

<Navestidlo
	lightCount={3}
	activeLights={aktivneZnaky}
	label={label ?? generateLabel('vlozene')}
	poleStyleClass="vlozene"
	labelStyleClass="hlavne"
></Navestidlo>
