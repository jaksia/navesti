<script lang="ts">
	import store from '$lib/store.svelte';
	import '../app.css';
	let { children } = $props();

	let mobileAlert = $state(true);

	function cancelDrag(e: Event) {
		if (!store.cancelDrag) return;
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<svelte:body ondragover={cancelDrag} ondragenter={cancelDrag} ondrop={cancelDrag} />

<div class="flex h-screen w-screen overflow-hidden select-none">
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

{#if mobileAlert}
	<div
		class="fixed inset-0 z-10 flex flex-col justify-center bg-black/80 p-2 text-center md:hidden"
	>
		<h1 class="text-2xl font-bold text-white">Úzka obrazovka</h1>
		<h4 class="text-sm text-white">
			Táto stránka nie je optimalizovaná pre zariadenia s úzkou obrazovkou, niektoré časti sa nebudú
			zobrazovať správne, prípadne nebudú vôbec fungovať.
		</h4>
		<button
			class="mx-auto mt-4 cursor-pointer rounded-lg bg-white/80 px-4 py-2 text-black hover:bg-white"
			onclick={() => (mobileAlert = false)}
		>
			Pokračovať
		</button>
	</div>
{/if}

<div class="absolute bottom-0 left-0 m-2 text-sm text-gray-500/50 select-none">
	<a href="https://github.com/jaksia/navesti" class="link" target="_blank">GitHub</a><br />
	&copy; {new Date().getFullYear()} Jakub Šiagi<br />
</div>
