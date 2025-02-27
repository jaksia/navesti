<script lang="ts">
	import { backButton } from '$lib/utils';
	import Icon from '@iconify/svelte';
</script>

<div class="relative h-screen w-screen bg-white">
	<a href="/svetlo" class="absolute top-0 right-0 m-5" onclick={backButton}>
		<Icon icon="bi:arrow-left" class="h-10 w-10 text-black" />
	</a>
</div>
