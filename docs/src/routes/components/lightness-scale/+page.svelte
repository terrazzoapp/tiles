<script lang="ts">
	import { type Oklch } from 'culori';
	import Example from '../../../components/example.svelte';
	import LightnessScale from '../../../../../src/lightness-scale.svelte';

	// state
	let ramp: Oklch[] = [
		{ mode: 'oklch', l: 0.96267849, c: 0.020046, h: 238.661395 },
		{ mode: 'oklch', l: 0.92658376, c: 0.039464, h: 240.005609 },
		{ mode: 'oklch', l: 0.86018483, c: 0.07594, h: 241.664871 },
		{ mode: 'oklch', l: 0.78198189, c: 0.114657, h: 243.826281 },
		{ mode: 'oklch', l: 0.71798902, c: 0.142157, h: 246.060937 },
		{ mode: 'oklch', l: 0.66890612, c: 0.157454, h: 248.31816 },
		{ mode: 'oklch', l: 0.62588981, c: 0.16415, h: 250.286502 },
		{ mode: 'oklch', l: 0.58562488, c: 0.159142, h: 251.2582 },
		{ mode: 'oklch', l: 0.54263076, c: 0.14852, h: 251.665838 },
		{ mode: 'oklch', l: 0.49717505, c: 0.133376, h: 251.590878 },
	];
	const code =
		`<script lang="ts"` +
		`>
import LightnessScale from '@terrazzo/tiles/lightness-scale.svelte';
</script` +
		`>

<LightnessScale /` +
		`>`;

	// reactivity
	$: highestChroma = ramp.reduce((highChroma, step) => (step.c > highChroma.c ? step : highChroma), ramp[0]!);
</script>

<svelte:head>
	<title>LightnessScale</title>
</svelte:head>

<div class="content">
	<h1>LightnessScale</h1>

	<p>Generate a scale of colors by perceptual lightness via Oklch.</p>

	<h2>Example</h2>

	<Example {code}>
		<LightnessScale hue={highestChroma.h ?? 0} chroma={highestChroma.c} {ramp} curve={[0.37, 0, 0.63, 1]} />
	</Example>
</div>
