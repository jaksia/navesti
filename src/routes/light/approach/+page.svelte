<script lang="ts">
	import { backButton } from '$lib/utils';
	import Icon from '@iconify/svelte';

	let activeBg = $state(0);
	const bgs = ['bg-green-500', 'bg-yellow-400'];

	setInterval(() => (activeBg = (activeBg + 1) % bgs.length), 2000);
</script>

<div class={['relative h-screen w-screen', bgs[activeBg]]}>
	<a href="/light" class="absolute right-0 m-5" onclick={backButton}>
		<Icon icon="bi:arrow-left" class="size-10 text-black" />
	</a>
</div>
