<script lang="ts">
	import { nanoid } from 'nanoid';
	import { omit } from './lib/props.js';

	export let id = `toggle-${nanoid(8)}`;
	export let checked: boolean;
	export let label = '';
</script>

<div class="toggle">
	<input {...omit($$props, ['id', 'label'])} class="input" type="checkbox" {id} bind:checked />
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.checkbox {
		@include typography('typography.base');

		display: inline-flex;
		flex-direction: column;
		font-size: 1rem;
		line-height: 1;
		position: relative;
		user-select: none;
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
		}

		&:focus-visible {
			~ .label {
				opacity: 1;
				z-index: token('layer.focus');
			}
		}
	}

	.label {
		@include typography('typography.label');

		cursor: pointer;
		display: block;
		opacity: 0.875;
		position: relative;
	}
</style>
