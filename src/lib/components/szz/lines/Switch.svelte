<script lang="ts">
	let {
		straight,
		switching,
		occupied,
		direction = 'tr'
	}: {
		straight: boolean;
		switching: boolean;
		occupied?: boolean;
		direction?: 'tl' | 'tr' | 'bl' | 'br';
	} = $props();

	const rotations = {
		tr: '-rotate-45',
		br: 'rotate-45',
		tl: 'rotate-225',
		bl: 'rotate-135'
	};

	const left = $derived(['tl', 'bl'].includes(direction));
</script>

<div
	class="relative my-[47.5%] flex aspect-4/1 justify-between gap-[10%] bg-stone-300 px-[10%] py-[7%]"
>
	<div
		class={[
			'absolute h-full w-3/5 origin-[center_left] bg-stone-300 px-[10%] py-[7%]',
			rotations[direction],
			left ? 'left-3/5' : 'left-2/5'
		]}
	>
		<div
			class={[
				'segment left-1/5 h-full w-4/5',
				{
					occupied: !straight && occupied === true,
					vacant: !straight && occupied === false,
					blinking: !straight && switching
				}
			]}
		></div>
	</div>
	<div
		class={[
			'segment h-full w-2/5',
			{
				occupied: (!left || straight) && occupied === true,
				vacant: (!left || straight) && occupied === false,
				blinking: (!left || straight) && switching
			}
		]}
	></div>
	<div
		class={[
			'segment h-full w-2/5',
			{
				occupied: (left || straight) && occupied === true,
				vacant: (left || straight) && occupied === false,
				blinking: (left || straight) && switching
			}
		]}
	></div>
</div>
