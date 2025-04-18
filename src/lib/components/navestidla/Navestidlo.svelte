<script lang="ts">
	import { colors } from '$lib/consts/styles';
	import type { Component, Snippet } from 'svelte';
	import Label from './parts/Label.svelte';
	import StlpNavestidlo from './display/StlpNavestidlo.svelte';
	import LavkaNavestidlo from './display/LavkaNavestidlo.svelte';
	import type { NavestidloDisplayParams } from './display/types';

	export type DisplayMode = 'stlp' | 'lavka';
	const components: Record<DisplayMode, Component<NavestidloDisplayParams>> = {
		stlp: StlpNavestidlo,
		lavka: LavkaNavestidlo
	};

	type PoleStyleClass = 'hlavne' | 'hlavne_jazda' | 'vlozene' | 'autoblok' | 'zriadovacie' | '';
	type LabelStyleClass =
		| 'hlavne'
		| 'hlavne_jazda'
		| 'vlozene'
		| 'autoblok'
		| 'zriadovacie'
		| 'predzvest'
		| '';
	const flippedLetters = ['U'];

	let {
		lightCount = 0,
		activeLights = [],
		speedIndication = false,
		speed = undefined,
		label = undefined,
		letters = {},

		poleStyleClass = '',
		labelStyleClass = poleStyleClass,

		topSigns,
		bottomSigns,
		renderLights: renderLightsOuter,
		renderBlankLights: renderBlankLightsOuter,

		displayMode = 'stlp'
	}: {
		lightCount?: number;
		activeLights?: (string | null)[];
		speedIndication?: boolean;
		speed?: number | null;
		label?: string;
		letters?: { [key: string]: boolean };

		poleStyleClass?: PoleStyleClass;
		labelStyleClass?: LabelStyleClass;

		topSigns?: Snippet;
		bottomSigns?: Snippet;
		renderLights?: Snippet;
		renderBlankLights?: Snippet;

		displayMode?: DisplayMode;
	} = $props();

	$effect(() => {
		if (speed !== undefined && !speedIndication) {
			console.warn('Speed indication is disabled, but speed is set.');
		}
		if (activeLights.length !== 0 && activeLights.length < lightCount) {
			console.warn('Light count is greater than supplied active lights.');
		}
	});

	const renderBlank = $derived(!renderLightsOuter || renderBlankLightsOuter ? true : false);
	const NavestidloComponent = $derived(components[displayMode]);

	let letterContainerHeight = $state(0);
	let labelHeight = $state(0);
</script>

<div class="navestidlo contents">
	<NavestidloComponent
		{renderBlank}
		label={label ? true : false}
		{poleStyleClass}
		renderTopSigns={topSigns}
		renderBottomSigns={bottomSigns}
		{labelHeight}
	>
		{#snippet renderBlankLights()}
			{#if renderBlankLightsOuter}
				{@render renderBlankLightsOuter()}
			{:else}
				{#each Array.from({ length: lightCount }) as _, i}
					<div class={['light aspect-square rounded-full', colors.blank]}></div>
				{/each}
				{#if speedIndication}
					<div class={['light aspect-square rounded-full', colors.blank]}></div>
					<div class={['light stripe !m-0 aspect-6/1', colors.blank]}></div>
					<div class="!m-0 aspect-7/1"></div>
					<div class={['light stripe !m-0 aspect-6/1', colors.blank]}></div>
					<div></div>
				{/if}
			{/if}
			{#each Object.entries(letters) as [letter, active]}
				<div
					class="light relative aspect-square rounded-full"
					bind:clientHeight={letterContainerHeight}
				>
					<div
						class={[
							'light letter absolute top-1/2 left-1/2 aspect-square -translate-1/2 rounded-full font-black text-stone-800',
							flippedLetters.includes(letter) && 'rotate-180'
						]}
						style="font-size: {letterContainerHeight}px;"
					>
						{letter}
					</div>
				</div>
			{/each}
		{/snippet}
		{#snippet renderLights()}
			{#if renderLightsOuter}
				{@render renderLightsOuter()}
			{:else}
				{#each Array.from({ length: lightCount }) as _, i}
					<div
						class={['light aspect-square rounded-full', activeLights[i] || colors.transparent]}
					></div>
				{/each}
				{#if speedIndication}
					<div
						class={['light aspect-square rounded-full', speed ? colors.yellow : colors.transparent]}
					></div>
					<div
						class={[
							'light stripe !m-0 aspect-6/1',
							speed === 60
								? colors.yellow
								: [80, 100].includes(speed ?? -1)
									? colors.green
									: colors.transparent
						]}
					></div>
					<div class="stripe !m-0 aspect-7/1"></div>
					<div
						class={[
							'light stripe !m-0 aspect-6/1',
							speed === 100 ? colors.green : colors.transparent
						]}
					></div>
					<div></div>
				{/if}
				{#each Object.entries(letters) as [letter, active]}
					<div class="light relative aspect-square">
						<div
							class={[
								'light letter absolute top-1/2 left-1/2 aspect-square -translate-1/2 rounded-full font-black',
								active ? 'text-white' : 'text-transparent',
								flippedLetters.includes(letter) && 'rotate-180'
							]}
							style="font-size: {letterContainerHeight}px;"
						>
							{letter}
						</div>
					</div>
				{/each}
			{/if}
		{/snippet}
		{#snippet renderLabel()}
			{#if label}
				<Label {labelStyleClass} {label} bind:labelHeight />
			{/if}
		{/snippet}
	</NavestidloComponent>
</div>

<style lang="scss">
	.navestidlo :global {
		.signs {
			--label-outline-size: 1px;
			--label-border-size: 3px;
		}

		.pole {
			position: relative;
			background: gray;
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
			&.hlavne_jazda {
				background-image: linear-gradient(
					to bottom,
					#fff 25%,
					#f00 25%,
					#f00 50%,
					#fff 50%,
					#fff 75%,
					#f00 75%
				);
			}
			&.vlozene {
				background-image: linear-gradient(
					to bottom,
					#fff 16%,
					#00f 16%,
					#00f 33%,
					#f00 33%,
					#f00 50%,
					#fff 50%,
					#fff 66%,
					#f00 66%,
					#f00 83%,
					#00f 83%
				);
			}
			&.autoblok {
				background: white;
			}
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
		}
	}
</style>
