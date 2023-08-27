<script lang="ts">
	import SegmentedControl from '../../../../../src/segmented-control.svelte';
	import SegmentedControlButton from '../../../../../src/segmented-control-button.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import SegmentedControl from '@terrazzo/tiles/segmented-control.svelte';
import SegmentedControlButton from '@terrazzo/tiles/segmented-control-button.svelte';

let color = 'hex';
</script` +
		`>

<SegmentedControl bind:value={selected}` +
		`>
  <SegmentedControlButton value="hex">Hex</SegmentedControlButton` +
		`>
  <SegmentedControlButton value="rgb">RGB</SegmentedControlButton` +
		`>
  <SegmentedControlButton value="oklab">Oklab</SegmentedControlButton` +
		`>
</SegmentedControl` +
		`>`;

	let color = 'hex';
</script>

<svelte:head>
	<title>SegmentedControl</title>
</svelte:head>

<div class="content">
	<h1>SegmentedControl</h1>

	<p>
		A SegmentedControl is not much different from a <a href="/components/radio">Radio</a>. Its major difference is in its implementation. While a Radio is used for form input, a SegmentedControl is used to temporarily adjust something else
		on the page and its value doesn’t persist.
	</p>

	<p>
		A SegmentedControl is also distinct from a tab, as it doesn’t have to be only used to hide/show information. And doesn’t carry with it the same accessibility requirements <a
			href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tabpanel_role"
			target="_blank"
			rel="noopener noreferrer">true tabs do</a
		>.
	</p>

	<p>
		Ironically, a SegmentedControl is truer in application to the <a href="https://www.nngroup.com/articles/radio-buttons-default-selection/" target="_blank" rel="noopener noreferrer">old mechanical car radio buttons</a> after which Radio is named.
	</p>

	<h2>Example</h2>

	<Example {code}>
		<SegmentedControl bind:value={color}>
			<SegmentedControlButton value="hex">sRGB</SegmentedControlButton>
			<SegmentedControlButton value="rgb">RGB</SegmentedControlButton>
			<SegmentedControlButton value="oklab">Oklab</SegmentedControlButton>
		</SegmentedControl>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;
</style>
