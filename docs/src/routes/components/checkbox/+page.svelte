<script lang="ts">
	import Checkbox from '../../../../../src/checkbox.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
  import Checkbox from '@terrazzo/tiles/checkbox.svelte';

  let isChecked = false;
</script` +
		`>

<Checkbox label="Agree to Terms and Conditions" bind:checked={isChecked} /` +
		`>`;

	let isChecked = false;
</script>

<svelte:head>
	<title>Checkbox</title>
</svelte:head>

<div class="content">
	<h1>Checkbox</h1>

	<p>A dual-purpose component that can either be used to select one or many from a list of options, or to agree/disagree to something.</p>

	<p>Don’t use for “off/on;” that should be reserved for <a href="./toggle">Toggle</a>.</p>

	<h2>Example</h2>

	<Example {code}>
		<Checkbox label="Agree to Terms and Conditions" bind:checked={isChecked} />
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
