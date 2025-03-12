<script lang="ts">
	import Icon from '@iconify/svelte';
	import store from '$lib/store.svelte';
</script>

<label class="swap swap-rotate ml-auto">
	<input type="checkbox" bind:checked={store.day} />

	<Icon icon="bi:sun-fill" class="swap-off size-6 fill-current" />

	<Icon icon="bi:moon-stars-fill" class="swap-on size-6 fill-current" />
</label>
