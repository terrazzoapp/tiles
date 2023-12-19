<script lang="ts">
	import { nanoid } from 'nanoid';
	import { onMount } from 'svelte';
	import { clamp } from './lib/number.js';
	import { omit } from './lib/props.js';

	// props
	export let id = `input-${nanoid(8)}`;
	export let label = '';
	export let name: string | undefined;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let size: 's' | 'm' | 'l' = 'm';
	export let value: number;

	// state
	let isDragging = false;
	let trackEl: HTMLDivElement;
	let trackRect = { left: 0, top: 0, x: 0, y: 0, width: 100, height: 4 } as DOMRect;

	// reactivity
	$: valuePercent = clamp((value - min) / (max - min), 0, 1);

	function recalcRects() {
		if (trackEl) {
			trackRect = trackEl.getBoundingClientRect();
		}
	}
	function handlePointerDown(evt: PointerEvent) {
		evt.preventDefault();
		recalcRects();
		isDragging = true;
	}
	function handlePointerMove(evt: PointerEvent) {
		evt.preventDefault(); // this prevents touch scroll and unwanted text highlights
		if (!isDragging) {
			return;
		}
		if (step === 0) {
			return;
		}
		const nextValue = Math.min(Math.max((evt.clientX - trackRect.left) / trackRect.width, 0), 1);
		value = Math.round((min + nextValue * (max - min)) / step) * step;
	}
	function handlePointerUp() {
		isDragging = false;
	}

	// lifecycle
	onMount(() => {
		recalcRects();

		addEventListener('pointermove', handlePointerMove);
		addEventListener('pointerup', () => (isDragging = false));

		// tear down
		return () => {
			removeEventListener('pointermove', handlePointerMove);
			removeEventListener('pointerup', handlePointerUp);
		};
	});
</script>

<div class="wrapper" {...omit($$props, ['id', 'label'])} data-size={size}>
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
	<div class="sliderWrapper">
		<div role="slider" class="slider" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} tabindex="0" on:pointerdown={handlePointerDown}>
			<div class="trackClip" bind:this={trackEl}>
				<div class="track" style={`--w: ${valuePercent}`} />
			</div>
			<button class="thumb" type="button" style={`--x: ${valuePercent * trackRect.width}px`}></button>
		</div>
		<input class="input" {id} {name} type="number" {step} {min} {max} inputmode="decimal" bind:value />
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.wrapper {
		--gap: #{token('size.m.gap')};
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};

		display: flex;
		flex-direction: column;
		gap: var(--gap);

		&[data-size='s'] {
			--gap: #{token('size.s.gap')};
			--height: #{token('size.s.height')};
			--padding: #{token('size.s.padding')};
			--radius: #{token('size.s.radius')};
		}

		&[data-size='l'] {
			--gap: #{token('size.l.gap')};
			--height: #{token('size.l.height')};
			--padding: #{token('size.l.padding')};
			--radius: #{token('size.l.radius')};
		}
	}

	.input {
		@include typography('typography.mono');

		-moz-appearance: textfield;
		-webkit-appearance: textfield;
		background: token('color.ui.bg');
		border: 1px solid color-mix(in oklab, currentColor, 75% transparent);
		color: token('color.ui.text');
		border-radius: var(--radius);
		height: var(--height);
		line-height: var(--height);
		outline: none;
		padding: 0 var(--padding) 0 0;
		text-indent: var(--gap);

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			margin: 0;
		}

		&:focus {
			border-color: #{token('color.ui.focus')};
		}
	}

	.label {
		@include typography('typography.label');

		align-items: center;
		display: flex;
	}

	.sliderWrapper {
		align-items: center;
		display: grid;
		gap: calc(2 * var(--padding));
		grid-template-columns: auto 4rem;
		transform: translateZ(0);
		user-select: none; // don’t highlight text while dragging
	}

	.slider {
		position: relative;
		z-index: token('layer.float');
	}

	.thumb {
		--size: 1.25rem;
		--dot-size: calc(0.375 * var(--size));

		background-color: token('color.ui.bg');
		border: 1px solid color-mix(in oklab, currentColor, 75% transparent);
		border-radius: 50%;
		color: token('color.ui.text');
		cursor: pointer;
		display: block;
		height: var(--size);
		left: calc(-0.5 * var(--size) + 1px);
		padding: 0;
		position: absolute;
		top: calc(-0.5 * var(--size) + 1px);
		transform: translate3d(var(--x), 0, 0);
		width: var(--size);
		z-index: 5;

		&::after {
			background-color: token('color.ui.action.base');
			border-radius: 50%;
			content: '';
			height: var(--dot-size);
			left: calc(0.5 * var(--size) - 1px - 0.5 * var(--dot-size)); // 1px = border width
			position: absolute;
			top: calc(0.5 * var(--size) - 1px - 0.5 * var(--dot-size));
			width: var(--dot-size);
		}
	}

	.track {
		background-color: #{token('color.ui.action.base')};
		height: 100%;
		left: 0;
		position: absolute;
		transform: scaleX(var(--w));
		transform-origin: 0 0;
		top: 0;
		width: 100%;
	}

	.trackClip {
		background-color: #{token('color.ui.bg-offset')};
		border-radius: 8rem;
		height: 0.25rem;
		overflow: hidden;
		position: relative;
	}
</style>
