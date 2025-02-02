<script lang="ts">
	import Icon from '@iconify/svelte';

	let bg = $state('bg-green-500');

	setInterval(() => {
		bg = bg === 'bg-green-500' ? 'bg-yellow-400' : 'bg-green-500';
	}, 1000);
</script>

<div class="relative h-screen w-screen {bg}">
	<a href="/svetlo" class="absolute right-0 top-0 m-5">
		<Icon icon="bi:arrow-left" class="h-10 w-10 text-black" />
	</a>
</div>
