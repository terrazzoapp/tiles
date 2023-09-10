<script lang="ts">
	import { clampChroma, modeOklch, modeRgb, useMode } from 'culori/fn';
	import Example from '../../../components/example.svelte';
	import * as palettes from '../../../lib/open-color.js';
	import ChromaTriangle from '../../../../../src/chroma-triangle.svelte';
	import FormRow from '../../../../../src/form-row.svelte';
	import Select from '../../../../../src/select.svelte';

	useMode(modeRgb);
	const toOklch = useMode(modeOklch);

	// state
	let selectedPalette: keyof typeof palettes = 'lime';
	let ramp = Object.values(palettes[selectedPalette]).map((c) => toOklch(c)!);
	const code =
		`<script lang="ts"` +
		`>
import ChromaTriangle from '@terrazzo/tiles/chroma-triangle.svelte';
</script` +
		`>

<ChromaTriangle /` +
		`>`;

	// reactivity
	$: {
		if (palettes[selectedPalette]) {
			ramp = Object.values(palettes[selectedPalette]).map((c) => toOklch(c)!);
		}
	}
	$: highestChroma = ramp.reduce((highChroma, step) => (clampChroma(step, 'rgb').c > highChroma.c ? step : highChroma), clampChroma(ramp[0]!));
</script>

<svelte:head>
	<title>ChromaTriangle</title>
</svelte:head>

<div class="content">
	<h1>ChromaTriangle</h1>

	<p>Generate a scale of colors by perceptual lightness via Oklch.</p>

	<h2>Example</h2>

	<Example {code}>
		<FormRow>
			<Select label="Palette" name="palette" options={Object.keys(palettes).map((name) => ({ label: name, value: name }))} bind:value={selectedPalette} />
		</FormRow>
		<ChromaTriangle hue={highestChroma.h ?? 0} {ramp} />
	</Example>
</div>
