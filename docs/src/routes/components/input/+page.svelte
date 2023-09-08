<script lang="ts">
	import Input from '../../../../../src/input.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import Input from '@terrazzo/tiles/input.svelte';
</script` +
		`>

<Input name="name" label="Name" type="text" /` +
		`>`;
</script>

<svelte:head>
	<title>Input</title>
</svelte:head>

<div class="content">
	<h1>Input</h1>

	<p>Inputs are freeform text entries, and can be of <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input" target="_blank" rel="noopener noreferrer">many types</a>.</p>

	<h2>Example</h2>

	<Example {code}>
		<Input name="name" label="Name" type="text" />
	</Example>
</div>
