<script lang="ts">
	import type { NavestidloDisplayParams } from './types';

	let {
		poleStyleClass,
		label,
		renderBlank,
		renderLabel,
		renderTopSigns,
		renderBottomSigns,
		renderLights,
		renderBlankLights
	}: NavestidloDisplayParams = $props();

	let labelHeight = $state(0);
	let labelSpacerHeight = $state(0);
</script>

<div class="relative flex h-full items-center">
	<div class="relative h-full">
		{#if renderBlank}
			<div class="lightsContainer rounded-full bg-stone-900">
				{@render renderBlankLights()}
			</div>
		{/if}
		<!-- <div class="lightsContainer rounded-full {renderBlank ? '' : 'bg-stone-900'}">
			{@render renderLights()}
			{#if label}
				<div
					class="absolute bottom-0 left-1/2 -z-10 aspect-square w-1/4 -translate-x-1/2 translate-y-full"
				>
					{@render renderLabel()}
				</div>
			{/if}
		</div> -->
	</div>
	<div class="pole relative h-3/4 min-w-2.5 {poleStyleClass}">
		<div
			class="signs absolute left-1/2 w-full"
			style="top: {label
				? `calc(${labelHeight - labelSpacerHeight}px + var(--label-outline-size) + var(--label-border-size))`
				: '0'}"
		>
			{@render renderTopSigns?.()}
		</div>
		<div class="signs absolute bottom-0 left-1/2 -translate-x-1/2">
			{@render renderBottomSigns?.()}
		</div>
	</div>
</div>

<style lang="scss">
	.lightsContainer {
		position: relative;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: stretch;

		padding: 15%;

		:global(> *) {
			margin-top: 6%;
			margin-bottom: 6%;
		}

		:global(> .light:not(.stripe)) {
			flex-grow: 2;
		}
		:global(> .stripe) {
			flex-grow: 1;
		}
	}
</style>
