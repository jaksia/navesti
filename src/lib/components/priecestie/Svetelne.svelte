<script lang="ts">
	// Svetelne - Bez bieleho svetla - Bez zavor

	import type { PriecestieProps } from '$lib/types/other';
	import SvetelneBiele from './SvetelneBiele.svelte';

	let {
		active,
		secure = $bindable(false),
		volume,
		trackCount,
		clear = $bindable(true)
	}: PriecestieProps = $props();
</script>

<SvetelneBiele {active} bind:secure {volume} {trackCount} bind:clear enableWhite={false} />
