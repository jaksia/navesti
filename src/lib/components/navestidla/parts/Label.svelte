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

	const boundLabelHeight = $derived(Math.max(15, labelHeight));
</script>

<div
	class="label rounded-lg font-bold {labelStyleClass}"
	bind:clientHeight={labelHeight}
	style="font-size: {boundLabelHeight * 0.7}px;
						   line-height: {boundLabelHeight * 0.85}px;
						   {boundLabelHeight <= 20 ? '--label-border-size: 2px; --label-py: 100%;' : ''}
						   min-width: {label.length}ch;"
>
	{label}
</div>

<style lang="scss">
	.label {
		--label-outline-size: 1px;
		--label-border-size: 3px;
		--label-py: 75%;

		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		height: 175%;
		min-height: 15px;

		padding: var(--label-py) 0.75ch;
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
		&.vyckavacie {
			background: #aaa;
			color: #fff;
		}
	}
</style>
