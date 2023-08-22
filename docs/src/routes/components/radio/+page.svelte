<script lang="ts">
	import FormRow from '../../../../../src/form-row.svelte';
	import Radio from '../../../../../src/radio.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import Radio from '@terrazzo/tiles/radio.svelte';

let selection = '';
</script` +
		`>

<Radio label="Bulbasaur" name="starter" bind:value={selection} /` +
		`>
<Radio label="Squirtle" name="starter" bind:value={selection} /` +
		`>
<Radio label="Charmander" name="starter" bind:value={selection} /` +
		`>`;

	let selection = false;
</script>

<svelte:head>
	<title>Radio</title>
</svelte:head>

<div class="content">
	<h1>Radio</h1>

	<p>A radio select is for selecting one and only one option from a list. Though there’s no hard rules, for a large number of options, a <a href="./select">Select</a> (possibly with a typeahead) might be better.</p>

	<h2>Example</h2>

	<Example {code}>
		<FormRow>
			<Radio label="Bulbasaur" name="starter" bind:value={selection} />
		</FormRow>
		<FormRow>
			<Radio label="Squirtle" name="starter" bind:value={selection} />
		</FormRow>
		<FormRow>
			<Radio label="Charmander" name="starter" bind:value={selection} />
		</FormRow>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
