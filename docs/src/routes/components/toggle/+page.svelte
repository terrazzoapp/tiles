<script lang="ts">
	import Toggle from '../../../../../src/toggle.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import Toggle from '@terrazzo/tiles/toggle.svelte';

let enabled = false;
</script` +
		`>

<Toggle label="Notifications" bind:checked={enabled} /` +
		`>`;

	let enabled = false;
</script>

<svelte:head>
	<title>Toggle</title>
</svelte:head>

<div class="content">
	<h1>Toggle</h1>

	<p>
		A toggle is an off/on switch, plain and simple. Though it behaves somewhat like a <a href="/components/checkbox">Checkbox</a>, this should only be used for pure &ldquo;off/on&rdquo; interactions. For agree/disagree, or selecting
		multiple of a list of options, a Checkbox is the better choice.
	</p>

	<h2>Example</h2>

	<Example {code}>
		<div>
			<Toggle label="Notifications" bind:checked={enabled} />
		</div>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
