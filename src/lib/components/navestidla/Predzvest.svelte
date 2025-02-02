<script lang="ts">
	import PredzvestBezVyhybiek from './znacky/PredzvestBezVyhybiek.svelte';

	import { colors } from '$lib/consts';
	import {
		getNavestneZnaky,
		povoleneOpakovanie,
		TypNavestidla,
		type Additional,
		type Predzvest,
		type Volno
	} from '$lib/navestidlo';
	import Navestidlo from './Navestidlo.svelte';
	import PredzvestVyhybky from './znacky/PredzvestVyhybky.svelte';
	import SkratenaVzdialenost from './znacky/SkratenaVzdialenost.svelte';

	let {
		navest,
		label,
		repeating = false,
		kryjeVyhybky = false,
		additional = null
	}: {
		navest: Predzvest | Volno | null;
		label?: string;
		repeating?: boolean;
		kryjeVyhybky?: boolean;
		additional?: Additional | null;
	} = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = getNavestneZnaky(navest, TypNavestidla.PREDZVEST);

		if (repeating && povoleneOpakovanie.includes(navest))
			znaky = znaky.map((znak, i) => (i === 2 ? colors.white : znak)); // Setting directly would affect navestneZnaky
		return znaky;
	});
</script>

<Navestidlo
	lightCount={repeating ? 3 : 2}
	activeLights={aktivneZnaky}
	{label}
	poleStyleClass="predzvest"
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
