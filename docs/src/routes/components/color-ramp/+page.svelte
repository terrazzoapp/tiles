<script lang="ts">
	import { modeOklch, modeRgb, useMode } from 'culori';
	import ColorRamp from '../../../../../src/color-ramp.svelte';
	import Example from '../../../components/example.svelte';
	import { blue } from '../../../lib/open-color.js';

	useMode(modeRgb);
	const toOklch = useMode(modeOklch);

	const code =
		`<script lang="ts"` +
		`>
  import { useMode, modeRgb, modeOklch } from 'culori';
  import ColorRamp from '@terrazzo/tiles/color-ramp.svelte';

  useMode(modeRgb);
  const toOklch = useMode(modeOklch);

  let steps = [color1, color2, color3, color4].map((c) => toOklch(c));
</script` +
		`>

<ColorRamp bind:steps /` +
		`>`;

	let steps = Object.values(blue).map((c) => toOklch(c));
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
