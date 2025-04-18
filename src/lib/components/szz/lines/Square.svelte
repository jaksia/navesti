<script lang="ts">
	type Rotation = 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl' | 't' | 'tr';

	let {
		occupied,
		light,
		rotation1 = 'l',
		rotation2 = 'r'
	}: {
		occupied?: boolean;
		light?: boolean;
		rotation1?: Rotation;
		rotation2?: Rotation;
	} = $props();

	const rotations: { [key in Rotation]: string } = {
		r: '',
		br: 'rotate-45',
		b: 'rotate-90',
		bl: 'rotate-135',
		l: 'rotate-180',
		tl: 'rotate-225',
		t: 'rotate-270',
		tr: 'rotate-315'
	};

	const coordinates: { [key in Rotation]: [string, string] } = {
		r: ['101 50', '95 50'],
		br: ['100 100', '95 95'],
		b: ['50 101', '50 95'],
		bl: ['0 100', '5 95'],
		l: ['-1 50', '5 50'],
		tl: ['0 0', '5 5'],
		t: ['50 -1', '50 5'],
		tr: ['100 0', '95 5']
	};
</script>

<div class="relative aspect-square">
	<svg
		class="absolute top-1/2 left-1/2 -z-20 size-full -translate-1/2 overflow-visible"
		viewBox="0 0 100 100"
	>
		<path
			d="M {coordinates[rotation1][0]} 50 50 {coordinates[rotation2][0]}"
			fill="none"
			stroke="oklch(0.869 0.005 56.366)"
			stroke-width="25"
		/>
	</svg>
	{#if light || occupied !== undefined}
		<svg class="absolute top-1/2 left-1/2 size-full -translate-1/2" viewBox="0 0 100 100">
			<path
				d="M {coordinates[rotation1][1]} 50 50 {coordinates[rotation2][1]}"
				fill="none"
				stroke-width="12.5"
				class="segment segment-svg-0"
			/>
			<path
				d="M {coordinates[rotation1][1]} 50 50 {coordinates[rotation2][1]}"
				fill="none"
				stroke-width="12.5"
				class={[
					{
						occupied,
						vacant: occupied === false
					},
					'segment segment-svg-1'
				]}
			/>
			<path
				d="M {coordinates[rotation1][1]} 50 50 {coordinates[rotation2][1]}"
				fill="none"
				stroke-width="12.5"
				class={[
					{
						occupied,
						vacant: occupied === false
					},
					'segment segment-svg-2'
				]}
			/>
		</svg>
	{/if}
</div>
