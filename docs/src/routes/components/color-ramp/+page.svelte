<script lang="ts">
	import type { Oklch } from 'culori';
	import ColorRamp from '../../../../../src/color-ramp.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import type { Oklch } from 'culori';
import ColorRamp from '@terrazzo/tiles/color-ramp.svelte';

let steps: Oklch[] = [
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
</script` +
		`>

<ColorRamp bind:steps /` +
		`>`;

	// state
	let steps: Oklch[] = [
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
</script>

<svelte:head>
	<title>ColorPicker</title>
</svelte:head>

<div class="content">
	<h1>ColorRamp</h1>

	<p>Develop a palette using your eyeballs!</p>

	<ul>
		<li><kbd>↑</kbd> <kbd>↓</kbd>: change <b>Value</b></li>
		<li><kbd>←</kbd> <kbd>→</kbd>: change <b>Saturation</b></li>
		<li><kbd>Alt + ←</kbd> <kbd>Alt + →</kbd>: change <b>Hue</b></li>
		<li><kbd>Alt + ↑</kbd> <kbd>Alt + ↓</kbd>: prev/next color</li>
		<li><kbd>Shift</kbd>: move in larger increments</li>
	</ul>

	<h2>Example</h2>

	<Example {code}>
		<div class="wrapper">
			<ColorRamp bind:steps />
		</div>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
