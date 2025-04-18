<script lang="ts">
	import { backButton } from '$lib/utils';
	import Icon from '@iconify/svelte';
</script>

<div class="relative h-screen w-screen bg-blue-700">
	<a href="/light" class="absolute top-0 right-0 m-5" onclick={backButton}>
		<Icon icon="bi:arrow-left" class="size-10 text-white" />
	</a>
</div>
