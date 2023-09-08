<script lang="ts">
	import type { Okhsv, Oklch } from 'culori';
	import { clampChroma, formatHex, formatHex8, modeOkhsv, modeOklch, modeRgb, parseHex, useMode } from 'culori/fn';
	import { createEventDispatcher, onMount } from 'svelte';
	import ColorSelect from 'svelte-color-select';
	import Input from './input.svelte';
	import { getMaxChroma } from './lib/color.js';
	import { clamp, snap } from './lib/number.js';
	import ValueInput from './value-input.svelte';

	const L_PRECISION = 10000;
	const C_PRECISION = 100000;
	const H_PRECISION = 100;
	const ALPHA_PRECISION = 100;

	// props
	export let color: Oklch = { mode: 'oklch', l: 0, c: 0, h: 0, alpha: 1 };
	/** amount hue changes from keyboard shortcuts */
	export let hChange = 0.2;
	/** amount saturation changes from keyboard shortcuts */
	export let sChange = 0.005;
	/** amount value changes from keyboard shortcuts */
	export let vChange = 0.005;
	/** amount shift key multiplies changes */
	export let shiftFactor = 5;

	// state
	let colorPickerEl: HTMLDivElement | null = null;
	const dispatch = createEventDispatcher();
	const toRGB = useMode(modeRgb);
	const toOkhsv = useMode(modeOkhsv);
	const toOklch = useMode(modeOklch);

	// reactivity
	function updateColor(evt: CustomEvent<{ okhsv: Okhsv }>) {
		color = toOklch(evt.detail.okhsv);
		dispatch('change', color);
	}
	function updateHex(evt: CustomEvent<string>) {
		const hex = parseHex(evt.detail);
		if (hex) {
			color = toOklch(hex);
			dispatch('change', color);
		}
	}
	function updateOklch(value: number, channel: 'l' | 'c' | 'h' | 'alpha') {
		let clampedValue = value;
		if (channel === 'l') {
			clampedValue = snap(clamp(value / 100, 0, 1), L_PRECISION);
		} else if (channel === 'c') {
			clampedValue = snap(clamp(value, 0, getMaxChroma(color.l, color.h ?? 0)), C_PRECISION);
		} else if (channel === 'h') {
			// for hue, wrap; don’t clamp
			clampedValue = value % 360;
			if (clampedValue < 0) {
				clampedValue += 360;
			}
			clampedValue = snap(clampedValue, H_PRECISION);
		} else if (channel === 'alpha') {
			clampedValue = snap(clamp(value / 100, 0, 1), ALPHA_PRECISION);
		}
		color = clampChroma({ ...color, [channel]: clampedValue }!, 'oklch');
		dispatch('change', color);
	}
	function updateOkhsv(value: number, channel: 'h' | 's' | 'v') {
		let clampedValue = value;
		if (channel === 's' || channel === 'v') {
			clampedValue = snap(clamp(value, 0, 1), L_PRECISION);
		} else if (channel === 'h') {
			// for hue, wrap; don’t clamp
			clampedValue = value % 360;
			if (clampedValue < 0) {
				clampedValue += 360;
			}
			clampedValue = snap(clampedValue, H_PRECISION);
		}
		color = toOklch(clampChroma({ ...okhsv, [channel]: clampedValue }!, 'okhsv'));
		dispatch('change', color);
	}
	function updateRGB(value: number, channel: 'r' | 'g' | 'b') {
		let clampedValue = clamp(value, 0, 255) / 255;
		color = toOklch({ ...rgb, [channel]: clampedValue });
		dispatch('change', color);
	}
	function handleKeydown(evt: KeyboardEvent) {
		switch (evt.key) {
			case 'ArrowUp': {
				if (evt.altKey) {
					return; // noop
				}
				evt.preventDefault();
				updateOkhsv(okhsv.v + vChange * (evt.shiftKey ? shiftFactor : 1), 'v');
				break;
			}
			case 'ArrowDown': {
				if (evt.altKey) {
					return; // noop
				}
				evt.preventDefault();
				updateOkhsv(okhsv.v - vChange * (evt.shiftKey ? shiftFactor : 1), 'v');
				break;
			}
			case 'ArrowLeft': {
				evt.preventDefault();
				if (evt.altKey) {
					updateOkhsv(okhsv.h - hChange * (evt.shiftKey ? shiftFactor : 1), 'h');
				} else {
					updateOkhsv(okhsv.s - sChange * (evt.shiftKey ? shiftFactor : 1), 's');
				}
				break;
			}
			case 'ArrowRight': {
				evt.preventDefault();
				if (evt.altKey) {
					updateOkhsv(okhsv.h + hChange * (evt.shiftKey ? shiftFactor : 1), 'h');
				} else {
					updateOkhsv(okhsv.s + sChange * (evt.shiftKey ? shiftFactor : 1), 's');
				}
				break;
			}
		}
	}

	$: okhsv = { ...toOkhsv(clampChroma(color, 'oklch')), h: color.h ?? 0 }; // keep hue at lightness 0% and 100%
	$: oklchDisplay = { l: snap(100 * color.l, L_PRECISION), c: snap(color.c, C_PRECISION), h: snap(color.h ?? 0, H_PRECISION), alpha: snap(100 * (color.alpha ?? 1), ALPHA_PRECISION) };
	$: rgb = toRGB(color);
	$: rgbDisplay = { r: Math.round(rgb.r * 255), g: Math.round(rgb.g * 255), b: Math.round(rgb.b * 255) };

	onMount(() => {
		// move focus to pick up on keyboard events
		colorPickerEl!.focus();
	});
</script>

<div class="color-picker">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="svelte-color-select" bind:this={colorPickerEl} tabindex="0" on:keydown={handleKeydown}>
		<ColorSelect {okhsv} on:change={updateColor} />
	</div>
	<div class="colorspace">
		<div class="colorspace-values">
			<ValueInput value={oklchDisplay.l} min={0} max={100} step={0.01} on:change={(evt) => updateOklch(evt.detail, 'l')}>L</ValueInput>
			<ValueInput value={oklchDisplay.c} min={0} max={getMaxChroma(color.l, color.h ?? 0)} step={0.001} on:change={(evt) => updateOklch(evt.detail, 'c')}>C</ValueInput>
			<ValueInput value={oklchDisplay.h} min={0} max={360} step={0.1} on:change={(evt) => updateOklch(evt.detail, 'h')}>H</ValueInput>
		</div>
		<div class="colorspace-values">
			<ValueInput value={rgbDisplay.r} min={0} max={255} step={1} on:change={(evt) => updateRGB(evt.detail, 'r')}>R</ValueInput>
			<ValueInput value={rgbDisplay.g} min={0} max={255} step={1} on:change={(evt) => updateRGB(evt.detail, 'g')}>G</ValueInput>
			<ValueInput value={rgbDisplay.b} min={0} max={255} step={1} on:change={(evt) => updateRGB(evt.detail, 'b')}>B</ValueInput>
		</div>
		<div class="colorspace-extra">
			<ValueInput value={oklchDisplay.alpha} min={0} max={100} step={0.1} on:change={(evt) => updateOklch(evt.detail, 'alpha')}>𝛼</ValueInput>
			<Input name="hex" type="text" size="s" value={(color.alpha ?? 1) === 1 ? formatHex(color) : formatHex8(color)} selectOnFocus on:change={updateHex} on:keyup={updateHex} />
		</div>
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.svelte-color-select {
		outline: none; // this is OK because unsighted users can/should use the ValueInput controls
	}

	:global(.svelte-color-select > *) {
		margin-left: -10px;
		margin-right: -15px;
		margin-top: -10px;

		:global(canvas) {
			background-color: token('color.ui.contrast.20');
			border-radius: token('size.s.radius');
		}

		:global(svg > g:last-of-type) {
			:global(polygon:first-child),
			:global(polygon:last-child) {
				fill: token('color.ui.contrast.90');
				stroke: none;
			}
		}
	}

	.colorspace {
		display: flex;
		flex-direction: column;
		gap: token('size.s.gap');

		&-extra {
			display: grid;
			gap: token('size.s.gap');
			grid-template-columns: 50% 50%;
		}

		&-values {
			border-bottom: 1px solid token('color.ui.contrast.30');
			display: grid;
			gap: token('size.s.gap');
			grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
			flex-direction: column;
		}
	}
</style>
