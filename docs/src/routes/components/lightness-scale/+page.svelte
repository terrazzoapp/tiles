<script lang="ts">
	import { clampChroma, modeOklch, modeRgb, useMode } from 'culori/fn';
	import Example from '../../../components/example.svelte';
	import LightnessScale from '../../../../../src/lightness-scale.svelte';
	import * as palettes from '../../../lib/open-color.js';
	import Select from '../../../../../src/select.svelte';
	import FormRow from '../../../../../src/form-row.svelte';

	useMode(modeRgb);
	const toOklch = useMode(modeOklch);
	const curves = {
		Linear: [0, 0, 1, 1] as [number, number, number, number],
		'Sine (In)': [0.12, 0, 0.39, 0] as [number, number, number, number],
		'Sine (In–Out)': [0.37, 0, 0.63, 1] as [number, number, number, number],
		'Sine (Out)': [0.61, 1, 0.88, 1] as [number, number, number, number],
		'Cubic (In)': [0.32, 0, 0.67, 0] as [number, number, number, number],
		'Cubic (In–Out)': [0.65, 0, 0.35, 1] as [number, number, number, number],
		'Cubic (Out)': [0.33, 1, 0.68, 1] as [number, number, number, number],
	};

	// state
	let selectedPalette: keyof typeof palettes = 'violet';
	let ramp = Object.values(palettes[selectedPalette]).map((c) => toOklch(c)!);
	let selectedCurve: keyof typeof curves = 'Linear';
	const code =
		`<script lang="ts"` +
		`>
  import LightnessScale from '@terrazzo/tiles/lightness-scale.svelte';
  import { modeOklch, modeRgb, useMode } from 'culori/fn';

  useMode(modeRgb);
  const toOklch = useMode(modeOklch);

  let hue = 240;
  let chroma = 0.2;
  let ramp = [color1, color2, color3, color4].map((c) => toOklch(c));
  let curve = [0.37, 0, 0.63, 1]; // optional: display a curve behind scale
</script` +
		`>

<LightnessScale {hue} {chroma} {ramp} {curve} /` +
		`>`;

	// reactivity
	$: {
		if (palettes[selectedPalette]) {
			ramp = Object.values(palettes[selectedPalette]).map((c) => toOklch(c)!);
		}
	}
	$: highestChroma = ramp.reduce((highChroma, step) => (clampChroma(step, 'rgb').c > highChroma.c ? step : highChroma), clampChroma(ramp[0]!, 'rgb'));
</script>

<svelte:head>
	<title>LightnessScale</title>
</svelte:head>

<div class="content">
	<h1>LightnessScale</h1>

	<p>Generate a scale of colors by perceptual lightness via Oklch.</p>

	<h2>Example</h2>

	<Example {code}>
		<FormRow>
			<Select label="Palette" name="palette" options={Object.keys(palettes).map((name) => ({ label: name, value: name }))} bind:value={selectedPalette} />
			<Select label="Curve" name="curve" options={[{ label: 'None', value: '' }, ...Object.keys(curves).map((name) => ({ label: name, value: name }))]} bind:value={selectedCurve} />
		</FormRow>
		<LightnessScale hue={highestChroma.h ?? 0} chroma={highestChroma.c} {ramp} curve={curves[selectedCurve]} />
	</Example>
</div>
