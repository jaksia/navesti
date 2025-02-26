<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex h-screen w-screen select-none">
	{@render children()}
</div>
