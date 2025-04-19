<script lang="ts">
	import { colors } from '$lib/consts/styles';
	import type { PriecestieProps } from '$lib/types/other';

	let { active, secure = $bindable(false), trackCount = 1 }: PriecestieProps = $props();

	let timer: number | null;

	$effect(() => {
		if (timer) clearTimeout(timer);
		white = false;
		secure = false;
		if (active) {
			timer = setTimeout(() => {
				secure = true;
			}, 5000);
		} else {
			timer = setTimeout(() => {
				white = true;
			}, 5000);
		}
	});

	let light = $state(0);
	let white = $state(false);

	setInterval(() => {
		light = light ? 0 : 1;
	}, 900);
</script>

{#snippet priecestieSvetlo()}
	<div class="pole priecestie relative h-2/5 w-4">
		<div
			class="absolute top-0 left-1/2 flex aspect-square w-30 -translate-x-1/2 -translate-y-full flex-col bg-stone-950"
		>
			<div
				class="sign absolute -top-1 -left-[5%] w-[110%] -translate-y-full rounded border-3 border-black bg-white px-1"
			>
				{#if trackCount == 1}
					<img src="/elements/priecestie/1-kolaj.svg" alt="znacka-1kolaj" />
				{:else}
					<img src="/elements/priecestie/viac-kolaji.svg" alt="znacka-viac-kolaji" />
				{/if}
			</div>
			<div class="contents">
				<div class="flex justify-stretch gap-2 p-2">
					<div class="aspect-square flex-1 rounded-full bg-stone-900"></div>
					<div class="aspect-square flex-1 rounded-full bg-stone-900"></div>
				</div>
				<div class="flex justify-stretch gap-2 p-2">
					<div class="flex flex-1 flex-col justify-center gap-1">
						{#each Array.from({ length: 4 }) as _}
							<div class="fin"></div>
						{/each}
					</div>
					<div class="aspect-square flex-2 rounded-full bg-stone-900"></div>
					<div class="flex flex-1 flex-col justify-center gap-1">
						{#each Array.from({ length: 4 }) as _}
							<div class="fin"></div>
						{/each}
					</div>
				</div>
			</div>
			<div class="absolute inset-0 flex flex-col">
				<div class="flex justify-stretch gap-2 p-2">
					<div
						class={[
							'light aspect-square flex-1 rounded-full duration-1000',
							active && light == 0 && colors.red
						]}
					></div>
					<div
						class={[
							'light aspect-square flex-1 rounded-full duration-1000',
							active && light == 1 && colors.red
						]}
					></div>
				</div>
				<div class="flex justify-stretch gap-2 p-2">
					<div class="flex-1"></div>
					<div
						class={[
							'light aspect-square flex-2 rounded-full duration-1000',
							white && light == 1 && colors.white
						]}
					></div>
					<div class="flex-1"></div>
				</div>
			</div>
			<div
				class="n-label absolute bottom-0 w-full translate-y-full rounded-sm border-2 border-red-500 bg-white text-center font-bold text-red-500"
			>
				POZOR VLAK
			</div>
		</div>
	</div>
{/snippet}
<div class="flex size-full items-end justify-between">
	{@render priecestieSvetlo()}
	{@render priecestieSvetlo()}
</div>

<style lang="scss">
	.n-label {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
		--label-border-size: 2px;
	}

	.fin {
		margin-top: 2px;
		border-top: 1px solid var(--color-stone-900);
		box-shadow: 0 0.5px 1px 1px var(--color-stone-900);
	}
</style>
