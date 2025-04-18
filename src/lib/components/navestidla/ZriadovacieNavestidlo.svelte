<script lang="ts">
	import { generateLabel } from '$lib/labels';
	import type { AllowedSignals } from '$lib/types/navestidlo';
	import { getNavestneZnaky, TypNavestidla } from '$lib/consts/navestidlo';
	import Navestidlo, { type DisplayMode } from './Navestidlo.svelte';

	let {
		navest,
		label = generateLabel('zriadovacie'),
		displayMode,
		letters
	}: {
		navest: AllowedSignals[TypNavestidla.ZRIADOVACIE] | null;
		label?: string;
		displayMode?: DisplayMode;
		letters?: { [key: string]: boolean };
	} = $props();

	const aktivneZnaky = $derived(getNavestneZnaky(navest, TypNavestidla.ZRIADOVACIE));
</script>

<Navestidlo
	lightCount={2}
	activeLights={aktivneZnaky}
	{label}
	poleStyleClass="zriadovacie"
	{displayMode}
	{letters}
></Navestidlo>
