<script lang="ts">
	import Slider from '../../../../../src/slider.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import Slider from '@terrazzo/tiles/slider.svelte';

let volume = 5;
let min = 0;
let max = 11;
</script` +
		`>

<Slider label="volume" name="vol" bind:value={volume} min={min} max={max} /` +
		`>`;

	let volume = 5;
</script>

<svelte:head>
	<title>Slider</title>
</svelte:head>

<div class="content">
	<h1>Slider</h1>

	<p>An “analog” control for visually representing a numeric value with defined <code>min</code> and <code>max</code> range. Sliders should always be accompanied by a traditional input for easier manipulation and better accessibility.</p>

	<h2>Example</h2>

	<Example {code}>
		<Slider label="Volume" name="vol" bind:value={volume} min={0} max={11} />
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
