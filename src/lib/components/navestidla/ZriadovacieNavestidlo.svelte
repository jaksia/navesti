<script lang="ts">
	import { generateLabel } from '$lib/labels';
	import { getNavestneZnaky, TypNavestidla, type AllowedSignals } from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';

	let {
		navest,
		label = generateLabel('zriadovacie')
	}: {
		navest: AllowedSignals[TypNavestidla.ZRIADOVACIE] | null;
		label?: string;
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.ZRIADOVACIE));
</script>

<Navestidlo lightCount={2} activeLights={aktivneZnaky} {label} poleStyleClass="zriadovacie"
></Navestidlo>
