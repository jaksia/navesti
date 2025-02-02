<script lang="ts">
	import { getNavestneZnaky, TypNavestidla, type VlozenaNavest } from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label
	}: {
		navest: VlozenaNavest;
		label?: string;
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.VLOZENE));
</script>

<Navestidlo lightCount={3} activeLights={aktivneZnaky} {label} poleStyleClass="vlozene"
></Navestidlo>
