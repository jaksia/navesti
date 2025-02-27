<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex h-screen w-screen select-none">
	{@render children()}
</div>

<noscript>
	<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
		<div class="rounded-lg bg-white p-4 shadow-lg">
			<div class="text-center">
				<h1 class="text-2xl font-bold">JavaScript is disabled</h1>
				<p class="text-gray-600">
					This site requires JavaScript to run. Please enable JavaScript in your browser settings.
				</p>
			</div>
		</div>
	</div>
</noscript>
