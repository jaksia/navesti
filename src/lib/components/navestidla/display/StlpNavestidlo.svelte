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

<div class="relative flex h-full w-full flex-col items-center">
	{#if renderBlank}
		<div class="lightsContainer z-10 rounded-full bg-stone-900">
			{@render renderBlankLights()}
		</div>
	{/if}
	<div class="lightsContainer z-20 rounded-full {renderBlank ? '' : 'bg-stone-900'}">
		{@render renderLights()}
		{#if label}
			<div
				class="absolute bottom-0 left-1/2 -z-10 aspect-square w-1/4 -translate-x-1/2 translate-y-full"
			>
				{@render renderLabel()}
			</div>
		{/if}
	</div>
	{#if label}
		<div class="relative aspect-square w-1/4" bind:clientHeight={labelSpacerHeight}></div>
	{/if}
	<div class="pole relative -z-10 h-full w-1/4 {poleStyleClass}">
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
		position: absolute;
		width: 100%;
		top: calc(var(--spacing) * 0.5); // top-0.5

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		translate: 0 -100%;

		padding: 15%;

		:global(> *) {
			margin-top: 7%;
			margin-bottom: 7%;
		}
	}
</style>
