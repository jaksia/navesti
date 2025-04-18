<script lang="ts">
	import PredzvestBezVyhybiek from './signs/PredzvestBezVyhybiek.svelte';

	import { colors } from '$lib/consts/styles';
	import type { Additional, AllowedSignals } from '$lib/types/navestidlo';
	import { getNavestneZnaky, TypNavestidla } from '$lib/consts/navestidlo';
	import Navestidlo, { type DisplayMode } from './Navestidlo.svelte';
	import PredzvestVyhybky from './signs/PredzvestVyhybky.svelte';
	import SkratenaVzdialenost from './signs/SkratenaVzdialenost.svelte';
	import { generateLabel } from '$lib/labels';

	let {
		navest,
		label,
		repeating = false,
		kryjeVyhybky = false,
		additional = null,
		displayMode,
		letters
	}: {
		navest: AllowedSignals[TypNavestidla.PREDZVEST] | null;
		label?: string;
		repeating?: boolean;
		kryjeVyhybky?: boolean;
		additional?: Additional | null;
		displayMode?: DisplayMode;
		letters?: { [key: string]: boolean };
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
	labelStyleClass="predzvest"
	{displayMode}
	{letters}
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
