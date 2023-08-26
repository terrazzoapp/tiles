<script lang="ts">
	import FormRow from '../../../../../src/form-row.svelte';
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

	<p>Slides</p>

	<h2>Example</h2>

	<Example {code}>
		<Slider label="Volume" name="vol" bind:value={volume} min={0} max={11} />
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
