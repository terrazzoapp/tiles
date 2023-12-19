<script lang="ts">
	import Combobox, { type Option } from '../../../../../src/combobox.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
  import Combobox from '@terrazzo/tiles/combobox.svelte';
</script` +
		`>

<Combobox
  label="Tokens"` +
		`
/>`;

	let value: Option[] = [];
	let options = [
		{ label: 'color.red.100', value: 'color.red.100' },
		{ label: 'color.red.200', value: 'color.red.200' },
		{ label: 'color.red.300', value: 'color.red.300' },
		{ label: 'color.red.400', value: 'color.red.400' },
		{ label: 'color.red.500', value: 'color.red.500' },
		{ label: 'color.red.600', value: 'color.red.600' },
		{ label: 'color.red.700', value: 'color.red.700' },
		{ label: 'color.red.800', value: 'color.red.800' },
		{ label: 'color.red.900', value: 'color.red.900' },
	];
</script>

<svelte:head>
	<title>Combobox</title>
</svelte:head>

<div class="content">
	<h1>Combobox</h1>

	<p>A combobox</p>

	<h2>Example</h2>

	<Example {code}>
		<Combobox label="Tokens" {options} {value} on:change={(evt) => (value = evt.detail)} />
		<pre><code>
		{value.map((v) => v.value).join(', ')}
		</code></pre>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
