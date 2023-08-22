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

		--textSize: #{token('size.m.textSize')};
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--radio-width: calc(0.5 * #{token('size.m.height')});

		display: inline-flex;
		flex-direction: column;
		font-size: var(--textSize);
		height: var(--height);
		justify-content: center;
		line-height: var(--height);
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
		top: 50%;
		transform: translate3d(0, -50%, 0);
		width: var(--radio-width);

		&:checked {
			~ .label {
				opacity: 1;

				&::after {
					opacity: 1;
					transform: translate3d(50%, -50%, 0) scale(1);
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

		align-items: center;
		cursor: pointer;
		display: flex;
		opacity: 0.875;
		padding-left: calc(var(--radio-width) + var(--padding));
		position: relative;

		&:empty {
			display: none;
		}

		&::before {
			border: 1px solid token('color.ui.contrast.60');
			border-radius: 10rem;
			content: '';
			display: block;
			height: var(--radio-width);
			left: 0;
			outline: 4px solid rgba(0, 0, 0, 0);
			position: absolute;
			top: 50%;
			transform: translate3d(0, -50%, 0);
			width: var(--radio-width);
			z-index: 1;
		}

		&::after {
			background: token('color.ui.contrast.90');
			border-radius: 50%;
			content: '';
			height: calc(0.5 * var(--radio-width));
			left: 0;
			opacity: 0;
			pointer-events: none;
			position: absolute;
			top: 50%;
			transform: translate3d(50%, -50%, 0) scale(0.5);
			width: calc(0.5 * var(--radio-width));
		}

		&:hover::before {
			border-color: token('color.ui.action.base');
		}
	}
</style>
