<script lang="ts">
	import { nanoid } from 'nanoid';
	import { omit } from './lib/props.js';

	// props
	export let id = `radio-${nanoid(8)}`;
	export let label = '';
	export let name: string;
	export let group: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	export let value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
</script>

<div class="radio">
	<input {...omit($$props, ['id', 'label', 'name', 'group', 'value', 'type'])} class="input" type="radio" {name} {id} bind:group {value} />
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.radio {
		@include typography('typography.base');

		--radio-width: 1em;

		display: inline-flex;
		flex-direction: column;
		font-size: var(--pocky-typography-button-font-size);
		line-height: var(--pocky-typography-button-line-height);
		position: relative;
		user-select: none;
	}

	.input {
		appearance: none;
		border: none;
		box-sizing: border-box;
		height: var(--radio-width);
		left: 0;
		margin: 0;
		opacity: 0;
		position: absolute;
		top: token('size.m.padding');
		transform: translate(1px, 1px);
		width: var(--radio-width);

		&:checked {
			~ .label {
				opacity: 1;

				&::after {
					opacity: 1;
					transform: translate3d(40.625%, 40.625%, 0) scale(1);
				}
			}
		}

		&:focus-visible {
			~ .label {
				opacity: 1;
				z-index: token('layer.focus');

				&::before {
					border-color: token('color.ui.contrast.90');
					outline-color: token('color.ui.focus');
				}
			}
		}
	}

	.label {
		@include typography('typography.label');

		cursor: pointer;
		display: block;
		opacity: 0.875;
		padding-left: calc(var(--radio-width) + #{token('size.m.padding')});
		position: relative;

		&:empty {
			display: none;
		}

		&::before {
			border: var(--pocky-border-std);
			border-radius: 10rem;
			content: '';
			display: block;
			height: var(--radio-width);
			left: 0;
			outline: 4px solid rgba(0, 0, 0, 0);
			position: absolute;
			top: 0;
			width: var(--radio-width);
			z-index: 1;
		}

		&::after {
			background: token('color.ui.contrast.90');
			border-radius: 50%;
			content: '';
			height: 0.625em;
			left: 0;
			opacity: 0;
			pointer-events: none;
			position: absolute;
			top: 0;
			transform: translate3d(40.625%, 40.625%, 0) scale(0.5);
			width: 0.625em;
		}

		&:hover::before {
			border-color: token('color.ui.action.base');
		}
	}
</style>
