<script lang="ts">
	import { nanoid } from 'nanoid';
	import { setContext } from 'svelte';

	// props
	export let value: string;

	// state
	const name = `segmented-control-${nanoid(8)}`;
	setContext('segmented-control-name', name);

	// reactivity
	$: setContext('segmented-control-value', value);
</script>

<fieldset
	{...$$props}
	class="segmented-control"
	on:change={(evt) => {
		const nextValue = evt.target.value;
		if (value) {
			value = nextValue;
		}
	}}
>
	<slot />
</fieldset>

<style lang="scss">
	@use '../tokens' as *;

	.segmented-control {
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		background-color: token('color.ui.contrast.10');
		border: none;
		border-radius: token('size.m.radius');
		box-shadow: inset #{token('shadow.base')};
		display: flex;
		margin: 0;
		padding: token('size.s.gap');
		width: min-content;
	}
</style>
