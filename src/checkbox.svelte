<script lang="ts">
	import { nanoid } from 'nanoid';
	import { omit } from './lib/props.js';

	export let id = `checkbox-${nanoid(8)}`;
	export let checked: boolean;
	export let label = '';
	export let name: string | undefined;
</script>

<div class="checkbox">
	<input {...omit($$props, ['id', 'label', 'name', 'value', 'group'])} class="input" type="checkbox" {name} {id} bind:checked />
	<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><polyline fill="none" points="64,256 192,384 448,128" /></svg>
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.checkbox {
		@include typography('typography.base');

		--checkbox-width: 1em;

		display: inline-flex;
		flex-direction: column;
		font-size: 1rem;
		line-height: 1;
		position: relative;
		user-select: none;

		&:hover {
			.label {
				&::before {
					border-color: token('color.ui.contrast.90');
				}
			}
		}
	}

	.checkmark {
		box-sizing: border-box;
		height: 0.75em;
		left: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		stroke-width: 64;
		stroke: token('color.ui.contrast.90');
		top: 1px;
		transform: translate3d(1px, 1px, 0);
		width: 0.75em;
	}

	.input {
		appearance: none;
		border: none;
		box-sizing: border-box;
		height: 1em;
		left: 0;
		margin: 0;
		opacity: 0;
		position: absolute;
		top: 0;
		transform: translate(1px, 1px);
		width: 1em;

		&:checked {
			~ .label {
				opacity: 1;
			}

			~ .checkmark {
				opacity: 1;
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
		padding-left: calc(var(--checkbox-width) + #{token('size.m.padding')});
		position: relative;

		&::before {
			border: 1px solid color-mix(in oklab, currentColor, 62.5% transparent);
			border-radius: token('size.s.radius');
			box-sizing: border-box;
			content: '';
			display: block;
			height: var(--checkbox-width);
			left: 0;
			outline-offset: 2px;
			outline: 4px solid rgba(0, 0, 0, 0);
			position: absolute;
			top: 1px;
			width: var(--checkbox-width);
		}

		&:hover::before {
			border-color: token('color.ui.focus');
		}
	}
</style>
