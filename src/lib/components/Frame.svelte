<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-full grow flex-col">
	<div
		class="frame relative flex min-h-44 items-stretch justify-around border-[12px] border-gray-600"
	>
		{@render children()}
	</div>
	<div class="flex grow justify-between">
		<div class="frame h-full min-w-24 border-x-8 border-gray-600"></div>
		<div class="frame h-full min-w-24 border-x-8 border-gray-600"></div>
	</div>
</div>

<style lang="scss">
	:root {
		--frame-gradient: transparent, transparent 20px, var(--color-gray-600) 20px,
			var(--color-gray-600) 25px, transparent 25px;
	}
	.frame {
		background-image: repeating-linear-gradient(45deg, var(--frame-gradient)),
			repeating-linear-gradient(-45deg, var(--frame-gradient));
	}
</style>
