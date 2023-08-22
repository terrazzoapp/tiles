<script lang="ts">
	import type { Oklch } from 'culori';
	import { formatCss, modeOklch, modeRgb, useMode } from 'culori/fn';
	import CodeBlock from '../../../../../src/code-block.svelte';
	import ColorPicker from '../../../../../src/color-picker.svelte';
	import Input from '../../../../../src/input.svelte';
	import Example from '../../../components/example.svelte';
	import { getIdealL, getMaxChroma, scaleChroma } from '../../../../../src/lib/color-picker.js';
	import { onMount } from 'svelte';

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
	let color: Oklch = { mode: 'oklch', l: 0.6, c: 0.165889, h: 252 };
	let supportsP3 = false;

	useMode(modeOklch);
	useMode(modeRgb);

	// reactivity
	$: idealL = getIdealL(color.h ?? 0);
	$: maxChroma = getMaxChroma(idealL, color.h ?? 0, supportsP3 ? 'p3' : 'rgb');

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
		<ColorPicker bind:color />

		<div class="preview">
			<div class="preview-color" style={`--color: ${formatCss(color)}`} />
			<div class="preview-controls">
				<div class="axis">
					<label class="axis-title" for="l">Lightness</label>
					<div class="axis-controls">
						<input id="l" class="slider" type="range" min={0} max={1} step={1 / L_PRECISION} bind:value={color.l} />
						<Input type="number" name="l" value={color.l * 100} min={0} max={100} step={100 / L_PRECISION} />
					</div>
				</div>
				<div class="axis">
					<label class="axis-title" for="c">Chroma</label>
					<div class="axis-controls">
						<input id="c" class="slider" type="range" min={0} max={maxChroma} step={1 / C_PRECISION} bind:value={color.c} />
						<Input type="number" name="c" min={0} max={maxChroma} step={1 / C_PRECISION} value={color.c} />
					</div>
				</div>
				<div class="axis">
					<label class="axis-title" for="h">Hue</label>
					<div class="axis-controls">
						<input id="h" class="slider" type="range" min={0} max={360} step={1 / H_PRECISION} value={color.h} />
						<Input type="number" name="h" min={0} max={360} step={1 / H_PRECISION} value={color.h} />
					</div>
				</div>
				<CodeBlock code={formatCss({ mode: 'oklch', l: Math.round(color.l * L_PRECISION) / L_PRECISION, c: Math.round(color.c * C_PRECISION) / C_PRECISION, h: Math.round((color.h ?? 0) * H_PRECISION) / H_PRECISION })} lang="css" />
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

	.preview {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5em;
		margin-top: 3rem;

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
