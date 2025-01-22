<script lang="ts">
	import {
		TypNavestidla,
		navestneZnaky,
		nazvyNavesti,
		opakovanieNavesti,
		povoleneNavesti,
		privolavaciaNavest,
		typeOptions,
		type Navest,
		type Rychlost
	} from '$lib/navestidlo';

	let typ = $state(TypNavestidla.HLAVNE);
	let rychlost: Rychlost | null = $state(null);

	let privolavacia = $state(false);
	let opakovanie = $state(false);
	let poslednyAutoblok = $state(true);

	let navest: Navest | null = $state(null);

	const aktivneZnaky = $derived.by(() => {
		let znaky: (string | null)[] = [];
		if (navest) {
			const options = navestneZnaky[navest];
			if (Array.isArray(options)) znaky = options;
			// @ts-ignore
			else znaky = options[typ] ?? options[TypNavestidla.HLAVNE];
		} else znaky = [null, null, null, null];

		if (privolavacia) znaky = znaky.map((znak, i) => znak ?? '' + (privolavaciaNavest[i] ?? ''));
		if (opakovanie) znaky = znaky.map((znak, i) => znak ?? '' + (opakovanieNavesti[i] ?? ''));
		return znaky;
	});

	const options = $derived(typeOptions[typ]);

	let safetyClicked = $state(false);
	const safetySignal = $derived.by(() => {
		if (navest === null) return 0;
		if (navest == 'stoj') return 2;
		if (opakovanie && navest == 'vystraha') return 2;
		if (opakovanie && [40, 60, 80, 100].includes(navest)) return 4;
		if (navest == 'vystraha') return 1;
		const l = ['volno', 40, 60, 80, 100];
		if (l.includes(navest)) return rychlost === null ? 3 : 4;
	});

	const speedEnabled = $derived(
		options.speedIndication &&
			(navest == null || [40, 60, 80, 100, 'volno', 'vystraha'].includes(navest))
	);

	$effect(() => {
		if (navest && !povoleneNavesti[typ].includes(navest)) navest = null;
		if (!speedEnabled) rychlost = null;
		opakovanie =
			opakovanie &&
			options.repeating &&
			navest !== null &&
			[40, 60, 80, 100, 'vystraha'].includes(navest);
		privolavacia = privolavacia && options.privolavanie;
		if (typ == TypNavestidla.AUTOBLOK && !poslednyAutoblok && [40, 60, 80, 100].includes(navest))
			navest = 'volno';
	});
</script>

<div class="relative flex flex-grow flex-col items-center justify-end bg-green-200">
	{#if [TypNavestidla.HLAVNE, TypNavestidla.HLAVNE_IBA_JAZDA, TypNavestidla.AUTOBLOK].includes(typ)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute left-4 top-4 flex items-center">
			<h3 class="mr-0.5 text-lg font-bold text-stone-800 [writing-mode:sideways-lr]">
				Pred návestidlom
			</h3>
			<div
				class="flex flex-col items-center gap-1 rounded-lg bg-stone-800 p-4"
				onclick={() => (safetyClicked = !safetyClicked)}
			>
				<div
					class="h-6 w-6 rounded-full {safetySignal == 1 ? 'bg-yellow-400' : 'bg-stone-900'}"
				></div>
				<div class="h-6 w-6 rounded-full {safetySignal == 2 ? 'bg-red-600' : 'bg-stone-900'}"></div>
				<div
					class="h-6 w-6 rounded-full {safetySignal == 3 ? 'bg-green-600' : 'bg-stone-900'}"
				></div>
				<div
					class="relative h-6 w-6 rounded-full p-[5px] {safetySignal == 4
						? 'bg-yellow-400'
						: 'bg-stone-900'}"
				>
					<div class="h-3.5 w-3.5 transform rounded-full bg-stone-900"></div>
				</div>
				<div
					class="mt-3 h-6 w-6 rounded-full {safetyClicked ? 'bg-sky-500' : 'bg-stone-900'}"
				></div>
			</div>
		</div>
	{/if}
	<div class="flex flex-col items-center">
		<div
			class="z-10 -mb-0.5 flex w-20 flex-col items-center justify-between gap-2 rounded-full bg-stone-900 p-3"
		>
			{#each Array.from({ length: options.bulbCount }) as _, i}
				<div class="h-14 w-14 rounded-full {aktivneZnaky[i] || 'bg-stone-800'}"></div>
			{/each}
			{#if options.speedIndication}
				<div class="h-14 w-14 rounded-full {rychlost ? 'bg-yellow-400' : 'bg-stone-800'}"></div>
				<div class="mb-1 flex h-10 w-14 flex-col justify-center gap-2">
					<div
						class="h-2 {rychlost === 60
							? 'bg-yellow-400'
							: [80, 100].includes(rychlost ?? -1)
								? 'bg-green-600'
								: 'bg-stone-800'}"
					></div>
					<div class="h-2 {rychlost === 100 ? 'bg-green-600' : 'bg-stone-800'}"></div>
				</div>
			{/if}
		</div>
		<div
			class="label z-10 -mb-0.5 rounded-lg px-2 py-0.5
			font-bold {options.labelStyleClass || options.poleStyleClass}"
		>
			{options.labelExample[(Math.random() * options.labelExample.length) | 0]}
		</div>
	</div>
	<div class="relative flex w-5 flex-col items-center">
		{#if poslednyAutoblok && typ == TypNavestidla.AUTOBLOK}
			<div class="relative h-16 w-16 border border-black bg-white p-2">
				<div class="h-12 w-12 rounded-full bg-black p-2">
					<div class="h-8 w-8 rounded-full bg-white p-2">
						<div class="h-4 w-4 rounded-full bg-black"></div>
					</div>
				</div>
			</div>
		{/if}
		<div class="pole w-full flex-grow {options.poleStyleClass}"></div>
	</div>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<div>
		<label for="typ">Typ návestidla</label>
		<select bind:value={typ} id="typ" name="typ" class="mt-1 block w-full">
			{#each Object.values(TypNavestidla) as typNavestidla}
				<option value={typNavestidla}>{typNavestidla}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="rychlost">Rýchlosť</label>
		<select
			bind:value={rychlost}
			id="rychlost"
			name="rychlost"
			class="mt-1 block w-full"
			disabled={!speedEnabled}
		>
			{#each [null, 40, 60, 80, 100] as rychlostOption}
				<option value={rychlostOption}>{rychlostOption ?? '---'}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="navest">Návesť</label>
		<select bind:value={navest} id="navest" name="navest" class="mt-1 block w-full">
			<option value={null}>---</option>
			{#each povoleneNavesti[typ] as navest}
				<option
					value={navest}
					disabled={typ == TypNavestidla.AUTOBLOK &&
						!poslednyAutoblok &&
						[40, 60, 80, 100].includes(navest)}>{nazvyNavesti[navest]}</option
				>
			{/each}
		</select>
	</div>
	<div>
		<label for="privolavacia">Privolávacia návesť</label>
		<input
			bind:checked={privolavacia}
			disabled={!options.privolavanie}
			id="privolavacia"
			name="privolavacia"
			type="checkbox"
			class="mt-1 block"
		/>
	</div>
	<div>
		<label for="opakovanie">Opakovanie</label>
		<input
			bind:checked={opakovanie}
			disabled={!options.repeating || !navest || ![40, 60, 80, 100, 'vystraha'].includes(navest)}
			id="opakovanie"
			name="opakovanie"
			type="checkbox"
			class="mt-1 block"
		/>
	</div>
	{#if typ == TypNavestidla.AUTOBLOK}
		<div>
			<label for="poslednyAutoblok">Posledné návestidlo automatického bloku</label>
			<input
				bind:checked={poslednyAutoblok}
				id="poslednyAutoblok"
				name="poslednyAutoblok"
				type="checkbox"
				class="mt-1 block"
			/>
		</div>
	{/if}
	<a href="/spadovisko" class="mt-auto font-bold underline">Spádovisko</a>
	<i class="mt-4z text-sm">
		Presný počet a poradie svetiel sa môže líšiť.<br />
		Napr. opakovacie hlavné návestidlá môžu mať <br />
		biele svetlo tam, kde býva štandardne červené.
	</i>
</div>

<style lang="scss">
	.pole {
		min-height: 24rem;
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
	.label {
		outline: 1px solid black;
		border: 3px solid white;

		&.hlavne {
			background: #f00;
			color: #fff;
		}
		&.autoblok {
			background: #fff;
			color: #000;
		}
		&.zriadovacie {
			background: #00f;
			color: #fff;
		}
		&.predzvest {
			background: black;
			color: #fff;
		}
	}
</style>
