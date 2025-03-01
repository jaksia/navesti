<script lang="ts">
	import { RezimSpadoviska, spadNavestneZnaky, type TypSpadNavestidla } from '$lib/spadovisko';

	let { mode, type, label }: { mode: RezimSpadoviska; type: TypSpadNavestidla; label: string } =
		$props();

	let aktivneZnaky = $derived(spadNavestneZnaky[type][mode]);
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-col items-center justify-between gap-1 rounded-full bg-stone-900 px-1 py-2">
		{#each Array.from({ length: type == 'hlavne' ? 4 : 3 }) as _, i}
			<div class="size-3 rounded-full {aktivneZnaky[i] || 'bg-stone-800'}"></div>
		{/each}
		<div class="relative size-3 font-black text-nowrap">
			<span
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 {mode ===
				RezimSpadoviska.SPAT
					? 'z-10 text-white'
					: 'text-stone-800'}">Z</span
			>
			{#if type === 'hlavne' || type == 'zriadovacie'}
				<span
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180
                {mode == RezimSpadoviska.ZAKAZANE || mode == RezimSpadoviska.SPAT
						? 'text-stone-800'
						: 'text-white'}
                ">U</span
				>
			{/if}
		</div>
	</div>
	<div
		class="label z-10 -mb-0.5 rounded-lg px-1 py-0.5 text-xs
        font-bold {type}"
	>
		{label}
	</div>
	<div class="pole h-16 w-2 {type}"></div>
</div>

<style lang="scss">
	.pole {
		background: gray;

		&.kmenove,
		&.zriadovacie {
			background-image: linear-gradient(
				to bottom,
				#00f 25%,
				#fff 25%,
				#fff 50%,
				#00f 50%,
				#00f 75%,
				#fff 75%
			);
		}
		&.hlavne {
			background-image: linear-gradient(
				to bottom,
				#f00 25%,
				#fff 25%,
				#fff 37.5%,
				#f00 37.5%,
				#f00 62.5%,
				#fff 62.5%,
				#fff 75%,
				#f00 75%
			);
		}
	}
	.label {
		outline: 0.5px solid black;
		border: 2px solid white;

		&.hlavne,
		&.kmenove {
			background: #f00;
			color: #fff;
		}
		&.zriadovacie,
		&.opakovacie {
			background: #00f;
			color: #fff;
		}
	}
</style>
