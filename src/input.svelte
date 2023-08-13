<script lang="ts">
	import { nanoid } from 'nanoid';
	import { omit } from './lib/props.js';

	// props
	export let id = `input-${nanoid(8)}`;
	export let label = '';
	export let name: string | undefined;
	export let type: HTMLInputElement['type'] = 'text';
	export let value: any;

	// reactivity
	$: spreadProps = omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value']);
</script>

<div class="input">
	{#if label}<label class="input-label" for={id}>{label}</label>{/if}
	<div class="input-wrapper">
		{#if type === 'text'}
			<input class="input-input" {...spreadProps} {name} {id} type="text" inputmode="text" bind:value />
		{:else if type === 'email'}
			<input class="input-input" {...spreadProps} {name} {id} type="email" inputmode="email" bind:value />
		{:else if type === 'number'}
			<input class="input-input" {...spreadProps} {name} {id} type="number" inputmode="decimal" bind:value />
		{:else if type === 'password'}
			<input class="input-input" {...spreadProps} {name} {id} type="password" bind:value />
		{:else if type === 'date'}
			<input class="input-input" {...spreadProps} {name} {id} type="date" bind:value />
		{:else}
			<input class="input-input" {...spreadProps} {name} {id} type="text" bind:value />
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.input {
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};
		--textSize: #{token('size.m.textSize')};

		@include typography('typography.base');

		color: token('color.ui.contrast.90');
		position: relative;
		width: 20em;
		z-index: token('layer.base');

		// components

		&-input {
			@include typography('typography.base');

			-moz-appearance: textfield;
			-webkit-appearance: textfield;
			background: none;
			border: 1px solid color-mix(in oklab, currentColor, 50% transparent);
			border-radius: var(--radius);
			color: inherit;
			display: block;
			font: inherit;
			height: var(--height);
			line-height: var(--height);
			padding: 0;
			text-indent: var(--padding); // padding crops text weird!
			width: 100%;

			&::-webkit-inner-spin-button,
			&::-webkit-outer-spin-button {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				margin: 0;
			}
		}

		&-label {
			color: token('color.ui.contrast.90');
			display: block;
			font-size: 1rem;
			margin-bottom: var(--padding);
			opacity: 0.75;
		}

		&-wrapper {
			display: flex;
			line-height: 1;
			position: relative;
			z-index: token('layer.base');
		}
	}
</style>
