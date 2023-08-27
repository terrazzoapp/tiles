<script lang="ts">
	import type { Oklch, Rgb } from 'culori';
	import { formatCss, formatRgb, modeOklch, modeRgb, useMode } from 'culori/fn';
	import CodeBlock from '../../../../../src/code-block.svelte';
	import ColorPicker from '../../../../../src/color-picker.svelte';
	import Input from '../../../../../src/input.svelte';
	import Example from '../../../components/example.svelte';
	import { getIdealL, getMaxChroma } from '../../../../../src/lib/color-picker.js';
	import { onMount } from 'svelte';
	import SegmentedControl from '../../../../../src/segmented-control.svelte';
	import SegmentedControlButton from '../../../../../src/segmented-control-button.svelte';

	const L_PRECISION = 10000;
	const C_PRECISION = 100000;
	const H_PRECISION = 100;

	const code =
		`<script lang="ts"` +
		`>
import type { Oklch } from 'culori';
import ColorPicker from '@terrazzo/tiles/color-picker.svelte';

let color: Oklch = { mode: 'oklch', l: 0.6, c: 0.165889, h: 252 };
</script` +
		`>

<ColorPicker bind:color={color} /` +
		`>`;

	// state
	let color = {
		oklch: { mode: 'oklch', l: 0.6, c: 0.165889, h: 252 } as Oklch,
		rgb: { mode: 'rgb', r: 30 / 255, g: 130 / 255, b: 223 / 255 } as Rgb,
	};
	let colorspace: 'oklch' | 'rgb' = 'oklch';
	let supportsP3 = false;

	useMode(modeOklch);
	useMode(modeRgb);

	// reactivity
	$: idealL = getIdealL(color.oklch.h ?? 0);
	$: maxChroma = getMaxChroma(idealL, color.oklch.h ?? 0, supportsP3 ? 'p3' : 'rgb');
	$: oklchCSS = formatCss({ mode: 'oklch', l: Math.round(color.oklch.l * L_PRECISION) / L_PRECISION, c: Math.round(color.oklch.c * C_PRECISION) / C_PRECISION, h: Math.round((color.oklch.h ?? 0) * H_PRECISION) / H_PRECISION });
	$: rgbCSS = formatRgb(color.rgb);

	onMount(() => {
		if (typeof CSS !== 'undefined') {
			supportsP3 = CSS.supports('color(display-p3 0 0 0)');
		}
	});
</script>

<svelte:head>
	<title>ColorPicker</title>
</svelte:head>

<div class="content">
	<h1>ColorPicker</h1>

	<p>When you need to pick colors</p>

	<h2>Example</h2>

	<Example {code}>
		<ColorPicker bind:color={color[colorspace]} />

		<div class="colorspace">
			<SegmentedControl bind:value={colorspace}>
				<SegmentedControlButton value="oklch">LCH</SegmentedControlButton>
				<SegmentedControlButton value="rgb">RGB</SegmentedControlButton>
			</SegmentedControl>
		</div>

		<div class="preview">
			<div class="preview-color" style={`--color: ${formatCss(color[colorspace])}`} />
			<div class="preview-controls">
				{#if colorspace === 'oklch'}
					<div class="axis">
						<label class="axis-title" for="l">Lightness</label>
						<div class="axis-controls">
							<input id="l" class="slider" type="range" min={0} max={1} step={1 / L_PRECISION} bind:value={color.oklch.l} />
							<Input type="number" name="l" value={color.oklch.l * 100} min={0} max={100} step={100 / L_PRECISION} />
						</div>
					</div>
					<div class="axis">
						<label class="axis-title" for="c">Chroma</label>
						<div class="axis-controls">
							<input id="c" class="slider" type="range" min={0} max={maxChroma} step={1 / C_PRECISION} bind:value={color.oklch.c} />
							<Input type="number" name="c" min={0} max={maxChroma} step={1 / C_PRECISION} value={color.oklch.c} />
						</div>
					</div>
					<div class="axis">
						<label class="axis-title" for="h">Hue</label>
						<div class="axis-controls">
							<input id="h" class="slider" type="range" min={0} max={360} step={1 / H_PRECISION} value={color.oklch.h} />
							<Input type="number" name="h" min={0} max={360} step={1 / H_PRECISION} value={color.oklch.h} />
						</div>
					</div>
					<CodeBlock code={oklchCSS} lang="css" />
				{:else}
					<div class="axis">
						<label class="axis-title" for="l">Red</label>
						<div class="axis-controls">
							<input id="r" class="slider" type="range" min={0} max={1} step={1 / 256} bind:value={color.rgb.r} />
							<Input type="number" name="r" min={0} max={255} value={Math.round(color.rgb.r * 25)} />
						</div>
					</div>
					<div class="axis">
						<label class="axis-title" for="c">Green</label>
						<div class="axis-controls">
							<input id="g" class="slider" type="range" min={0} max={1} step={1 / 256} bind:value={color.rgb.g} />
							<Input type="number" name="g" min={0} max={255} value={Math.round(color.rgb.g * 255)} />
						</div>
					</div>
					<div class="axis">
						<label class="axis-title" for="h">Blue</label>
						<div class="axis-controls">
							<input id="b" class="slider" type="range" min={0} max={1} step={1 / 256} bind:value={color.rgb.b} />
							<Input type="number" name="b" min={0} max={255} value={Math.round(color.rgb.b * 255)} />
						</div>
					</div>
					<CodeBlock code={rgbCSS} lang="css" />
				{/if}
			</div>
		</div>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;

	.axis {
		&-title {
			display: block;
		}

		&-controls {
			display: grid;
			gap: 0.5rem;
			grid-template-columns: auto 3fr;
		}
	}

	.colorspace {
		margin-top: 2rem;
	}

	.preview {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5em;
		margin-top: 1.5rem;

		&-color {
			background-color: var(--color);
		}

		&-controls {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
