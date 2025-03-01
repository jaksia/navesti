<script lang="ts">
	let {
		labelStyleClass = '',
		label = '',
		labelHeight = $bindable(0)
	}: {
		labelStyleClass?: string;
		label?: string;
		labelHeight?: number;
	} = $props();
</script>

<div
	class="label rounded-lg font-bold {labelStyleClass}"
	bind:clientHeight={labelHeight}
	style="font-size: {labelHeight * 0.7}px;
						   line-height: {labelHeight * 0.85}px;
						   {labelHeight <= 20 ? 'border-width: 2px;' : ''}
						   min-width: {label.length + 2}ch;"
>
	{label}
</div>

<style lang="scss">
	.label {
		--label-outline-size: 1px;
		--label-border-size: 3px;

		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		height: 175%;
		min-height: 15px;

		padding: 5% 25%;
		text-align: center;

		outline: var(--label-outline-size) solid black;
		border: var(--label-border-size) solid white;
		font-weight: bold;

		background: #fff;
		color: #000;

		&.hlavne {
			background: #f00;
			color: #fff;
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
