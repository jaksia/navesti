<script lang="ts">
	import { backButton } from '$lib/utils';
	import Icon from '@iconify/svelte';

	let bg = $state('bg-green-500');

	setInterval(() => {
		bg = bg === 'bg-green-500' ? 'bg-yellow-400' : 'bg-green-500';
	}, 1000);
</script>

<div class={['relative h-screen w-screen', bg]}>
	<a href="/svetlo" class="absolute top-0 right-0 m-5" onclick={backButton}>
		<Icon icon="bi:arrow-left" class="size-10 text-black" />
	</a>
</div>
