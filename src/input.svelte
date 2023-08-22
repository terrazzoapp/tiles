<script lang="ts">
	import { nanoid } from 'nanoid';
	import { omit } from './lib/props.js';

	// props
	export let id = `input-${nanoid(8)}`;
	export let label = '';
	export let name: string | undefined;
	export let size: 's' | 'm' | 'l' = 'm';
	export let type: HTMLInputElement['type'] = 'text';
	export let value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
</script>

<div class="input" data-size={size}>
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
	<div class="field-wrapper">
		{#if type === 'text'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value'])} {name} {id} type="text" inputmode="text" bind:value />
		{:else if type === 'email'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value'])} {name} {id} type="email" inputmode="email" bind:value />
		{:else if type === 'number'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value'])} {name} {id} type="number" inputmode="decimal" bind:value />
		{:else if type === 'password'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value'])} {name} {id} type="password" bind:value />
		{:else if type === 'date'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value'])} {name} {id} type="date" bind:value />
		{:else}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'type', 'value'])} {name} {id} type="text" bind:value />
		{/if}
	</div>
	<div class="note"><slot name="note" /></div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.input {
		--height: #{token('size.m.height')};
		--gap: #{token('size.m.gap')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};
		--textSize: #{token('size.m.textSize')};

		@include typography('typography.base');

		color: token('color.ui.contrast.90');
		font-variant-numeric: tabular-nums;
		position: relative;
		min-width: 0;
		z-index: token('layer.base');

		&[data-size='s'] {
			--height: #{token('size.s.height')};
			--padding: #{token('size.s.padding')};
			--radius: #{token('size.s.radius')};
			--textSize: #{token('size.s.textSize')};
		}

		&[data-size='l'] {
			--height: #{token('size.l.height')};
			--padding: #{token('size.l.padding')};
			--radius: #{token('size.l.radius')};
			--textSize: #{token('size.l.textSize')};
		}
	}

	.field {
		@include typography('typography.base');

		-moz-appearance: textfield;
		-webkit-appearance: textfield;
		background: none;
		border: 1px solid color-mix(in oklab, currentColor, 75% transparent);
		border-radius: var(--radius);
		color: inherit;
		display: block;
		height: var(--height);
		line-height: var(--height);
		min-width: 0;
		padding: 0 var(--gap) 0 0;
		text-indent: var(--gap);

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			margin: 0;
		}

		&:focus {
			border-color: token('color.ui.focus');
		}
	}

	.field-wrapper {
		display: flex;
		line-height: 1;
		position: relative;
		z-index: token('layer.base');
	}

	.label {
		@include typography('typography.label');

		color: token('color.ui.contrast.90');
		display: block;
		margin-bottom: calc(0.5 * var(--padding));
		opacity: 0.75;
	}

	.note {
		@include typography('typography.footnote');

		margin-top: calc(0.5 * var(--padding));

		&:empty {
			display: none;
		}
	}
</style>
