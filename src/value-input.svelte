<script lang="ts">
	import { nanoid } from 'nanoid';
	import { createEventDispatcher, onMount } from 'svelte';
	import { omit } from './lib/props.js';

	// props
	export let value: number;
	export let id = `input-${nanoid(6)}`;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step = 1;

	// state
	const dispatch = createEventDispatcher();
	let isDragging = false;
	let dragStartX = 0;
	let dragStartValue = value; // keep track of original value so delta is applied properly
	let lastFrame: number | undefined = undefined;

	// reactivity
	function handlePointerDown(evt: PointerEvent) {
		isDragging = true;
		dragStartValue = value;
		dragStartX = evt.clientX;
	}
	function handlePointerMove(evt: PointerEvent) {
		evt.preventDefault(); // this prevents touch scroll and unwanted text highlights
		if (!isDragging) {
			return;
		}
		if (lastFrame) {
			cancelAnimationFrame(lastFrame);
		}
		lastFrame = requestAnimationFrame(() => {
			const delta = step * (Math.round(evt.clientX - dragStartX) || 0); // avoid -0; 1px == 1 step
			let nextValue = dragStartValue + delta;
			nextValue = Math.round(nextValue / (step || 1)) * step; // clamp to nearest step
			if (typeof min === 'number') {
				nextValue = Math.max(min, nextValue);
			}
			if (typeof max === 'number') {
				nextValue = Math.min(max, nextValue);
			}
			value = nextValue;
			dispatch('change', value);
			lastFrame = undefined;
		});
	}
	function handlePointerUp() {
		isDragging = false;
	}
	function handleChange(evt: Event) {
		value = (evt.target as HTMLInputElement).valueAsNumber;
		dispatch('change', value);
	}

	// lifecycle
	onMount(() => {
		// note: bind events to window because users will drag cursor off originating element
		addEventListener('pointermove', handlePointerMove);
		addEventListener('pointerup', handlePointerUp);
		return () => {
			removeEventListener('pointermove', handlePointerMove);
			removeEventListener('pointerup', handlePointerUp);
		};
	});
</script>

<div class="value-input">
	<label class="label" for={id} on:pointerdown={handlePointerDown}><slot /></label>
	<input
		{...omit($$props, ['class', 'id', 'max', 'min', 'size', 'step', 'value'])}
		on:focus={(evt) => evt.currentTarget.select()}
		class="input"
		{id}
		type="number"
		inputmode="decimal"
		{min}
		{max}
		{step}
		{value}
		on:change={handleChange}
		on:keyup={handleChange}
	/>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.value-input {
		--gap: #{token('size.s.gap')};
		--height: #{token('size.s.height')};
		--padding: #{token('size.s.padding')};
		--textSize: #{token('size.s.textSize')};

		align-items: center;
		border: 1px solid transparent;
		display: grid;
		gap: var(--gap);
		grid-template-columns: calc(1rem + 2 * var(--padding)) auto;
		outline: 1px solid transparent;

		&:hover {
			border-color: token('color.ui.contrast.20');
		}

		&:focus-within {
			border-color: token('color.ui.focus');
			outline-color: token('color.ui.focus');
		}
	}

	.input {
		-moz-appearance: textfield;
		-webkit-appearance: textfield;
		appearance: textfield;
		background: none;
		border-radius: 0;
		border: none;
		color: token('color.ui.text');
		font-family: token('typography.family.mono');
		font-size: var(--textSize);
		font-variant-numeric: tabular-nums;
		height: var(--height);
		line-height: var(--height);
		min-width: 3rem;
		padding: 0;
		text-indent: var(--gap);
		width: auto;

		&:focus {
			outline: none;
		}

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			margin: 0;
		}
	}

	.label {
		@include typography('typography.label');

		color: token('color.ui.contrast.60');
		cursor: ew-resize;
		line-height: 1;
		padding-left: var(--padding);
		padding-right: var(--padding);
		user-select: none; // don’t highlight text while dragging
	}
</style>
