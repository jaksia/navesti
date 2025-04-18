<script lang="ts">
	let {
		occupied,
		light
	}: {
		occupied?: boolean;
		light?: boolean;
	} = $props();
</script>

<div class="my-[47.5%] aspect-4/1 bg-stone-300 px-[10%] py-[7%]">
	{#if occupied !== undefined || light}
		<div
			class={[
				'segment size-full',
				{
					occupied,
					vacant: occupied === false
				}
			]}
		></div>
	{/if}
</div>
