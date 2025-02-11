<script lang="ts">
	import { colors } from '$lib/consts';
	import { nazvyNavesti } from '$lib/navestidlo';
	import Icon from '@iconify/svelte';

	const blank = colors.blank + ' bg-opacity-80';

	let day = $state(true);

	let navest = $state('stoj');

	let secondArm = $state(false);
	let yellowArm = $state(false);

	let armRotation = $state('rotate-0');
	let secondArmRotation = $state('rotate-0');
	let yellowRotation = $state('rotate-0');
	let lightColor = $state(blank);
	let secondLightColor = $state(blank);

	let predzvestTransform = $state('');
	let predzvestLightColor = $state(blank);

	$effect(() => {
		if (navest == 'vystraha' && !yellowArm) navest = 'stoj';
		if (navest == '40' && !secondArm) navest = 'stoj';

		if (navest == 'volno') {
			armRotation = '-rotate-45';
			secondArmRotation = '-rotate-90';
			yellowRotation = '-rotate-90';
			(lightColor = colors.green), (secondLightColor = blank);
		} else if (navest == 'stoj') {
			armRotation = 'rotate-0';
			secondArmRotation = '-rotate-90';
			yellowRotation = '-rotate-90';
			(lightColor = colors.red), (secondLightColor = blank);
		} else if (navest == 'vystraha') {
			armRotation = '-rotate-45';
			secondArmRotation = '-rotate-90';
			yellowRotation = 'rotate-0';
			(lightColor = colors.yellow), (secondLightColor = blank);
		} else if (navest == '40') {
			armRotation = '-rotate-45';
			secondArmRotation = '-rotate-45';
			yellowRotation = 'rotate-0';
			if (yellowArm) (lightColor = colors.yellow), (secondLightColor = colors.yellow);
			else (lightColor = colors.green), (secondLightColor = colors.green);
		}

		if (navest == 'stoj' || navest == '40')
			(predzvestTransform = ''), (predzvestLightColor = colors.yellow);
		else (predzvestTransform = 'rotate3d(1,0,0,88deg)'), (predzvestLightColor = colors.green);
	});
</script>

<div
	class="relative flex grow items-end justify-around {day
		? 'bg-linear-to-t from-lime-300 via-cyan-200 to-cyan-300 [&_.light]:opacity-50'
		: 'bg-radial-[at_95%_5%] from-gray-600 to-gray-800 to-20% [&_.arm]:border [&_.arm]:border-black'}"
	style="--arm-opacity: {day ? '100%' : '10%'};"
>
	{#if !day}
		<div
			class="absolute top-[5%] left-[95%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 drop-shadow-2xl"
		></div>
	{/if}
	<div class="relative h-3/5 w-4 bg-white {day ? '' : 'bg-opacity-10 border border-black'}">
		<div
			class="light absolute left-full ml-1 h-8 w-8 -translate-y-1/2 transform rounded-full {predzvestLightColor}"
			style="top: 7.5rem;"
		></div>
		<div
			class="absolute top-0 left-1/2 transition-transform duration-1000 ease-in-out"
			style="transform: {predzvestTransform};"
		>
			<div
				class="arm absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 transform rounded-full border bg-white/(--arm-opacity)"
			></div>
			<div
				class="arm absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-black bg-yellow-300/(--arm-opacity)"
			></div>
		</div>
	</div>
	<div class="relative h-4/5 w-4 bg-white {day ? '' : 'bg-opacity-10 border border-black'}">
		<div
			class="light absolute left-full ml-1 h-8 w-8 -translate-y-1/2 transform rounded-full {lightColor}"
			style="top: 5rem;"
		></div>
		{#if secondArm}
			<div
				class="light absolute left-full ml-1 h-8 w-8 -translate-y-1/2 transform rounded-full {secondLightColor}"
				style="top: 13rem;"
			></div>
		{/if}
		{#if yellowArm}
			<div
				class="absolute left-1/2 transform transition-transform duration-1000 ease-in-out {yellowRotation}"
				style="top: 3rem;"
			>
				<div
					class="arm absolute aspect-[4] w-48 -translate-x-[15%] -translate-y-[50%] transform bg-yellow-300/(--arm-opacity)"
				>
					<div class="absolute top-0 left-[30%] h-1/5 w-[70%] bg-white/(--arm-opacity)"></div>
					<div class="absolute top-[80%] left-[30%] h-1/5 w-[70%] bg-white/(--arm-opacity)"></div>
				</div>
			</div>
		{/if}
		<div
			class="absolute left-1/2 transform transition-transform duration-1000 ease-in-out {armRotation}"
			style="top: {3}rem;"
		>
			<div
				class="arm absolute aspect-[4] w-48 -translate-x-[15%] -translate-y-[50%] transform bg-red-600/(--arm-opacity)"
			>
				<div class="absolute top-1/3 left-[30%] h-1/3 w-[70%] bg-white/(--arm-opacity)"></div>
			</div>
		</div>
		{#if secondArm}
			<div
				class="absolute left-1/2 transform transition-transform duration-1000 ease-in-out {secondArmRotation}"
				style="top: {13}rem;"
			>
				<div
					class="arm absolute aspect-[4] w-48 -translate-x-[15%] -translate-y-[50%] transform bg-red-600/(--arm-opacity)"
				>
					<div class="absolute top-1/3 left-[30%] h-1/3 w-[70%] bg-white/(--arm-opacity)"></div>
				</div>
			</div>
		{/if}
	</div>
</div>
<div class="flex flex-col bg-gray-500 p-5">
	<button onclick={() => (day = !day)} class="ml-auto rounded-md p-1">
		{#if day}
			<Icon icon="bi:moon-stars-fill" class="h-6 w-6" />
		{:else}
			<Icon icon="bi:sun-fill" class="h-6 w-6" />
		{/if}
	</button>
	<div>
		<label for="secondArm">Druhé rameno:</label>
		<input type="checkbox" id="secondArm" bind:checked={secondArm} class="mt-1 block" />
	</div>
	<div>
		<label for="yellowArm">Žlté rameno:</label>
		<input type="checkbox" id="yellowArm" bind:checked={yellowArm} class="mt-1 block" />
	</div>
	<div>
		<label for="navest">Návesť:</label>
		<select id="navest" bind:value={navest} class="mt-1 block">
			<option value="stoj">{nazvyNavesti['stoj']}</option>
			<option value="volno">{nazvyNavesti['volno']}</option>
			<option value="vystraha" disabled={!yellowArm}>{nazvyNavesti['vystraha']}</option>
			<option value="40" disabled={!secondArm}>Rýchlosť 40 km/h a Výstraha </option>
		</select>
	</div>
	<a href="/" class="mt-auto font-bold underline">Normálne návestidlá</a>
</div>
