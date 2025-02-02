<script lang="ts">
	import {
		getNavestneZnaky,
		navestneZnaky,
		TypNavestidla,
		type ZriadovaciaNavest
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label
	}: {
		navest: ZriadovaciaNavest;
		label?: string;
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.ZRIADOVACIE));
</script>

<Navestidlo lightCount={2} activeLights={aktivneZnaky} {label} poleStyleClass="zriadovacie"
></Navestidlo>
