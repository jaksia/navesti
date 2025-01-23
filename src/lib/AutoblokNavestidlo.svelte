<script lang="ts">
	import { navestneZnaky, TypNavestidla, type AutoblokNavest, type Predzvest } from './navestidlo';

	let {
		navest,
		label,
		posledne = false
	}: { navest: AutoblokNavest | Predzvest; label?: string; posledne?: boolean } = $props();

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			else
				znaky = options[TypNavestidla.AUTOBLOK] ??
					options[TypNavestidla.HLAVNE] ?? [null, null, null, null];
		} else znaky = [null, null, null, null];

		return znaky;
	});
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-col items-center justify-between gap-1 rounded-full bg-stone-900 px-1 py-2">
		{#each Array.from({ length: 3 }) as _, i}
			<div class="h-3 w-3 rounded-full {aktivneZnaky[i] || 'bg-stone-800'}"></div>
		{/each}
	</div>
	{#if label}
		<div class="label z-10 -mb-0.5 rounded-lg px-0.5 py-0.5 text-2xs font-bold">
			{label}
		</div>
	{/if}
	<div class="pole relative h-16 w-1.5 bg-white">
		{#if posledne}
			<div
				class="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 transform border border-black bg-white p-0.75"
			>
				<div class="h-4 w-4 rounded-full bg-black p-0.5">
					<div class="h-3 w-3 rounded-full bg-white p-0.75">
						<div class="h-1.5 w-1.5 rounded-full bg-black"></div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.label {
		outline: 0.5px solid black;
		border: 2px solid white;

		background: #fff;
		color: #000;
	}
</style>
