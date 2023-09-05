<script lang="ts">
	import Select from '../../../../../src/select.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import Select from '@terrazzo/tiles/select.svelte';

let value: string | undefined = undefined;
let options = [
	{ label: 'United States', value: 'us' },
	{ label: 'Argentina', value: 'ar' },
	{ label: 'China', value: 'cz' },
	{ label: 'United Kingdom', value: 'gb' },
	{ label: 'Japan', value: 'jp' },
	{ label: 'Norway', value: 'no' },
	{ label: 'Switzerland', value: 'ch' },
];
</script` +
		`>

<Select label="Country" name="Country" {options} bind:value /` +
		`>`;

	let options = [
		{ label: 'United States', value: 'us' },
		{ label: 'Argentina', value: 'ar' },
		{ label: 'China', value: 'cz' },
		{ label: 'United Kingdom', value: 'gb' },
		{ label: 'Japan', value: 'jp' },
		{ label: 'Norway', value: 'no' },
		{ label: 'Switzerland', value: 'ch' },
	];
</script>

<svelte:head>
	<title>Select</title>
</svelte:head>

<div class="content">
	<h1>Select</h1>

	<p>A Select control lets a user select one and only one option, like a <a href="/components/radio">Radio</a> However, a Select works well when there are many, many options&mdash;so many it&raquo;d take up several pages.</p>

	<h2>Example</h2>

	<Example {code}>
		<Select label="Country" name="country" {options} />
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
