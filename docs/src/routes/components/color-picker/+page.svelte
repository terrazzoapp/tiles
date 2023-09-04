<script lang="ts">
	import type { Oklch } from 'culori';
	import { modeOklch, modeRgb, useMode } from 'culori/fn';
	import ColorPicker from '../../../../../src/color-picker.svelte';
	import Example from '../../../components/example.svelte';
	import { onMount } from 'svelte';

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
		<div class="wrapper">
			<ColorPicker bind:color />
		</div>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;

	.wrapper {
		background-color: token('color.ui.bg-offset');
		box-shadow: 0 1rem 2rem rgba(black, 0.1);
		border-radius: token('size.m.radius');
		padding: 1rem;
		width: min-content;
	}
</style>
