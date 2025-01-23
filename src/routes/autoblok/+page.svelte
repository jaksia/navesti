<script lang="ts">
	import AutoblokNavestidlo from '$lib/AutoblokNavestidlo.svelte';
	import {
		nazvyNavesti,
		TypNavestidla,
		type HlavnaNavest,
		povoleneNavesti,
		type Rychlost
	} from '$lib/navestidlo';
	import VchodoveNavestidlo from '$lib/VchodoveNavestidlo.svelte';

	let vchodoveNavestidlo: HlavnaNavest = $state('stoj');
	let vchodoveNavestidloRychlost: Rychlost | null = $state(null);
	let vchodoveNavestidloPrivolavacia = $state(false);

	let trainpos = $state(1);

	const oddiel = $derived.by(() => {
		const result = [false, false, false, false, false];
		result[Math.floor((trainpos + 1) / 5)] = true;
		return result;
	});

	const poslednyAutoblok = $derived.by(() => {
		if (vchodoveNavestidlo === 'stoj') return 'vystraha';
		else if (vchodoveNavestidloRychlost !== null) return vchodoveNavestidloRychlost;
		else return 'volno';
	});

	$effect(() => {
		if (vchodoveNavestidloPrivolavacia) vchodoveNavestidlo = 'stoj';
		if (vchodoveNavestidlo === 'stoj') vchodoveNavestidloRychlost = null;
	});
</script>

<div class="flex flex-col justify-center overflow-hidden bg-green-200">
	<table cellspacing="0" cellpadding="0" class="h-min w-full">
		<tbody>
			<tr>
				<td colspan={trainpos}></td>
				<td
					><div
						class="absolute left-1/2 top-0 z-10 w-[150%] -translate-x-1/2 -translate-y-1/3 transform"
					>
						<img src="/track/train.svg" />
					</div></td
				>
			</tr>
			<tr class="track">
				{#each Array.from({ length: 23 }) as _}
					<td><img src="/track/straight_v.svg" /></td>
				{/each}
			</tr>
			<tr>
				<td colspan="3"></td>
				<td
					><div class="navestidlo">
						<AutoblokNavestidlo navest={oddiel[1] ? 'stoj' : oddiel[2] ? 'vystraha' : 'volno'} />
					</div></td
				>
				<td colspan="4"></td>
				<td
					><div class="navestidlo">
						<AutoblokNavestidlo navest={oddiel[2] ? 'stoj' : oddiel[3] ? 'vystraha' : 'volno'} />
					</div></td
				>
				<td colspan="4"></td>
				<td
					><div class="navestidlo">
						<AutoblokNavestidlo navest={oddiel[3] ? 'stoj' : oddiel[4] ? 'vystraha' : 'volno'} />
					</div></td
				>
				<td colspan="4"></td>
				<td
					><div class="navestidlo">
						<AutoblokNavestidlo navest={oddiel[4] ? 'stoj' : poslednyAutoblok} posledne={true} />
					</div></td
				>
				<td colspan="3"></td>
				<td>
					<div class="navestidlo">
						<VchodoveNavestidlo
							navest={vchodoveNavestidlo}
							rychlost={vchodoveNavestidloRychlost}
							privolavacia={vchodoveNavestidloPrivolavacia}
						/>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<div>
		<label for="vchodovehoNavestidlo">Návesť vchodového návestidla:</label>
		<select bind:value={vchodoveNavestidlo} id="vchodovehoNavestidlo">
			{#each povoleneNavesti[TypNavestidla.HLAVNE_IBA_JAZDA] as navest}
				<option value={navest} disabled={navest !== 'stoj' && vchodoveNavestidloPrivolavacia}
					>{nazvyNavesti[navest]}</option
				>
			{/each}
		</select>
	</div>
	<div>
		<label for="vchodovehoNavestidloRychlost">Rýchlosť vchodového návestidla:</label>
		<select
			bind:value={vchodoveNavestidloRychlost}
			id="vchodovehoNavestidloRychlost"
			disabled={vchodoveNavestidlo === 'stoj'}
		>
			<option value={null}>---</option>
			{#each [40, 60, 80, 100] as rychlost}
				<option value={rychlost}>{rychlost} km/h</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="vchodovehoNavestidloPrivolavacia">Privolávacia návest:</label>
		<input
			type="checkbox"
			bind:checked={vchodoveNavestidloPrivolavacia}
			id="vchodovehoNavestidloPrivolavacia"
		/>
	</div>
	<div>
		<label for="trainpos">Pozícia vlaku:</label>
		<input type="range" min="1" max="21" step="1" bind:value={trainpos} id="trainpos" />
	</div>
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>

<style lang="scss">
	.track {
		transform: perspective(1000px) rotateX(45deg);
	}

	td {
		position: relative;

		.navestidlo {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 20;
		}
	}
</style>
