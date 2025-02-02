<script lang="ts">
	import PoslednyAutoblok from './znacky/PoslednyAutoblok.svelte';

	import {
		getNavestneZnaky,
		TypNavestidla,
		type AutoblokNavest,
		type Predzvest
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label,
		posledne = false
	}: { navest: AutoblokNavest | Predzvest | null; label?: string; posledne?: boolean } = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.AUTOBLOK));
</script>

<Navestidlo
	lightCount={3}
	activeLights={aktivneZnaky}
	speedIndication={false}
	{label}
	poleStyleClass="autoblok"
>
	{#snippet topSigns()}
		{#if posledne}
			<PoslednyAutoblok />
		{/if}
	{/snippet}
</Navestidlo>
