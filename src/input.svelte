<script lang="ts">
	import { nanoid } from 'nanoid';
	import { createEventDispatcher } from 'svelte';
	import { omit } from './lib/props.js';

	// props
	export let id = `input-${nanoid(8)}`;
	export let label = '';
	export let name: string | undefined;
	export let selectOnFocus = false;
	export let size: 's' | 'm' | 'l' = 'm';
	export let type: HTMLInputElement['type'] = 'text';
	export let value: any; // eslint-disable-line @typescript-eslint/no-explicit-any

	// state
	const dispatch = createEventDispatcher();
	let inputEl: HTMLInputElement | null = null;

	// reactivity
	$: {
		if (inputEl) {
			inputEl.addEventListener('change', (evt) => {
				dispatch('change', (evt.target as HTMLInputElement)[type === 'number' ? 'valueAsNumber' : 'value']);
			});
			inputEl.addEventListener('keydown', (evt) => {
				dispatch('keydown', (evt.target as HTMLInputElement)[type === 'number' ? 'valueAsNumber' : 'value']);
			});
			inputEl.addEventListener('keyup', (evt) => {
				dispatch('keyup', (evt.target as HTMLInputElement)[type === 'number' ? 'valueAsNumber' : 'value']);
			});
			if (selectOnFocus) {
				inputEl.addEventListener('focus', (evt) => (evt.target as HTMLInputElement).select());
			}
		}
	}
</script>

<div class="input" data-size={size}>
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
	<div class="field-wrapper">
		{#if type === 'text'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'selectOnFocus', 'size', 'type', 'value'])} {name} {id} type="text" inputmode="text" bind:value bind:this={inputEl} />
		{:else if type === 'email'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'selectOnFocus', 'size', 'type', 'value'])} {name} {id} type="email" inputmode="email" bind:value bind:this={inputEl} />
		{:else if type === 'number'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'selectOnFocus', 'size', 'type', 'value'])} {name} {id} type="number" inputmode="decimal" bind:value bind:this={inputEl} />
		{:else if type === 'password'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'selectOnFocus', 'size', 'type', 'value'])} {name} {id} type="password" bind:value bind:this={inputEl} />
		{:else if type === 'date'}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'selectOnFocus', 'size', 'type', 'value'])} {name} {id} type="date" bind:value bind:this={inputEl} />
		{:else}
			<input class="field" {...omit($$props, ['id', 'inputmode', 'label', 'name', 'selectOnFocus', 'size', 'type', 'value'])} {name} {id} type="text" bind:value bind:this={inputEl} />
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
		--textSize: #{token('size.m.textSize')};

		@include typography('typography.base');

		color: token('color.ui.contrast.90');
		gap: var(--gap);
		display: flex;
		flex-direction: column;
		font-variant-numeric: tabular-nums;
		min-width: 0;
		position: relative;
		z-index: token('layer.base');

		&[data-size='s'] {
			--height: #{token('size.s.height')};
			--padding: #{token('size.s.padding')};
			--textSize: #{token('size.s.textSize')};
		}

		&[data-size='l'] {
			--height: #{token('size.l.height')};
			--padding: #{token('size.l.padding')};
			--textSize: #{token('size.l.textSize')};
		}
	}

	.field {
		@include typography('typography.base');

		-moz-appearance: textfield;
		-webkit-appearance: textfield;
		appearance: textfield;
		background: none;
		border-radius: 0;
		border: 1px solid color-mix(in oklab, currentColor, 75% transparent);
		color: inherit;
		display: block;
		flex: 1 1 auto;
		font-variant-numeric: tabular-nums;
		height: var(--height);
		line-height: var(--height);
		max-width: 100%;
		min-width: 0;
		padding: 0 var(--gap) 0 0;
		text-indent: var(--gap);
		width: auto;

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
		opacity: 0.75;

		&:empty {
			display: none;
		}
	}

	.note {
		@include typography('typography.footnote');

		margin-top: calc(0.5 * var(--padding));

		&:empty {
			display: none;
		}
	}
</style>
