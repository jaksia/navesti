<script lang="ts">
	import DayNight from '$lib/components/DayNight.svelte';
	import DayNightToggle from '$lib/components/DayNightToggle.svelte';
	import Label from '$lib/components/navestidla/parts/Label.svelte';
	import { colors } from '$lib/consts';
	import { generateLabel } from '$lib/labels';

	let posunDovoleny = $state(false);
	let kolajovaVaha = $state(true);
	let vyckavacieNavestidlo = $state(false);
</script>

<svelte:head>
	<title>Mechanické zriaďovacie návestidlá</title>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<DayNight class="flex grow items-end justify-around">
	<div
		class="pole zriadovacie relative h-1/2 w-4 cursor-pointer"
		onclick={() => (posunDovoleny = !posunDovoleny)}
	>
		<div
			class="light absolute left-full ml-1 size-8 -translate-y-1/2 rounded-full {posunDovoleny
				? colors.white
				: colors.blue}"
			style="top: 6rem;"
		></div>
		<div
			class="absolute top-0 left-1/2 transition-transform duration-1000 ease-in-out"
			style="transform: {posunDovoleny ? 'rotate3d(1,0,0,88deg)' : ''};"
		>
			<div class="arm absolute size-30 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white"></div>
			<div
				class="arm absolute size-26 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-blue-600"
			></div>
		</div>
		<div class="absolute top-1/2 aspect-square w-[110%]">
			<Label label={generateLabel('zriadovacie')} labelStyleClass="zriadovacie" />
		</div>
	</div>
	<div
		class="pole relative h-1/2 w-4 cursor-pointer bg-white *:transition-transform *:duration-1000"
		onclick={() => (kolajovaVaha = !kolajovaVaha)}
	>
		<div
			class="absolute top-0 right-3.5 w-26 {kolajovaVaha ? 'rotate-45' : ''}"
			style="transform-origin: 100% 10%;"
		>
			<img src="/vaha.svg" alt="" class="-scale-x-100 dark:hidden" />
			<img src="/vaha-dark.svg" alt="" class="hidden -scale-x-100 dark:block" />
		</div>
		<div
			class="absolute top-0 left-3.5 w-26 {kolajovaVaha ? '-rotate-45' : ''}"
			style="transform-origin: 0 10%;"
		>
			<img src="/vaha.svg" alt="" class="dark:hidden" />
			<img src="/vaha-dark.svg" alt="" class="hidden dark:block" />
		</div>
	</div>
	<div
		class="pole zriadovacie relative h-2/5 w-4 cursor-pointer"
		onclick={() => (vyckavacieNavestidlo = !vyckavacieNavestidlo)}
	>
		<div class="absolute top-0 left-1/2 w-36 -translate-x-1/2 -translate-y-full">
			<img src="/vyckavacie.svg" alt="" class="dark:hidden" />
			<img src="/vyckavacie-dark.svg" alt="" class="hidden dark:block" />
			<div class="absolute bottom-0 left-1/2 size-8 -translate-x-1/2 translate-y-full bg-stone-800">
				<div
					class="light m-2 size-4 rounded-full {vyckavacieNavestidlo ? 'bg-white' : 'bg-stone-600'}"
				></div>
			</div>
			<div class="absolute top-0 left-0 size-8 -translate-y-full bg-stone-800">
				<div
					class="light m-2 size-4 rounded-full {vyckavacieNavestidlo ? 'bg-white' : 'bg-stone-600'}"
				></div>
			</div>
			<div class="absolute top-0 right-0 size-8 -translate-y-full bg-stone-800">
				<div
					class="light m-2 size-4 rounded-full {vyckavacieNavestidlo ? 'bg-white' : 'bg-stone-600'}"
				></div>
			</div>
		</div>
		<div class="absolute top-1/3 aspect-square w-[110%]">
			<Label label={generateLabel('vyckavacie')} labelStyleClass="vyckavacie" />
		</div>
	</div>
</DayNight>
<div class="flex w-1/5 flex-col gap-4 p-5">
	<DayNightToggle />
	<div class="mt-auto">
		<a href="/" class="mt-auto font-bold underline">Naspäť</a>
	</div>
</div>

<style lang="scss">
	.pole {
		&.zriadovacie {
			background-image: linear-gradient(
				to bottom,
				#fff 12.5%,
				#00f 12.5%,
				#00f 25%,
				#fff 25%,
				#fff 37.5%,
				#00f 37.5%,
				#00f 50%,
				#fff 50%,
				#fff 62.5%,
				#00f 62.5%,
				#00f 75%,
				#fff 75%,
				#fff 87.5%,
				#00f 87.5%,
				#00f 100%
			);
		}
	}
	:global(.night) .pole::before,
	:global(.night) .label::before {
		background-color: #000c !important;
	}
	:global(.night) .arm::after {
		background-color: #000b !important;
	}
</style>
