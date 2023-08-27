<script lang="ts">
	import { nanoid } from 'nanoid';
	import { getContext } from 'svelte';
	import { omit } from './lib/props.js';

	// props
	export let id = `segmented-control-${nanoid(8)}`;

	export let value: any;

	// state
	const name = getContext<string>('segmented-control-name');
	const parentValue = getContext<typeof value>('segmented-control-value');
</script>

<input class="input" {name} {id} type="radio" {value} checked={parentValue === value} />
<label {...omit($$props, ['id'])} class="label" for={id}><slot /></label>

<style lang="scss">
	@use '../tokens' as *;
	@use './styles/util' as *;

	.input {
		height: 1px;
		position: absolute;
		right: 150vw;
		width: 1px;
	}

	.label {
		--gap: #{token('size.s.gap')};
		--height: #{token('size.s.height')};
		--padding: #{token('size.s.padding')};
		--radius: #{token('size.s.radius')};
		--textSize: #{token('size.s.textSize')};

		@include typography('typography.base');

		align-items: center;
		background: none;
		border-radius: var(--radius);
		color: token('color.ui.contrast.60');
		cursor: pointer;
		display: flex;
		font-size: var(--textSize);
		gap: var(--gap);
		height: var(--height);
		justify-content: center;
		line-height: var(--height);
		outline: 2px solid transparent;
		padding-bottom: 0;
		padding-left: var(--padding);
		padding-right: var(--padding);
		padding-top: 0;
		position: relative;
		white-space: nowrap;

		&:hover {
			background-color: opacity(token('color.ui.bg-offset'), 37.5%);
			box-shadow: #{token('shadow.base')};

			@include darkMode {
				background-color: opacity(token('color.ui.contrast.40'), 35%);
				color: token('color.ui.contrast.80');
			}
		}

		.input:focus-visible + & {
			outline-color: token('color.ui.focus');
			z-index: token('layer.float');
		}

		.input:checked + & {
			background-color: token('color.ui.bg-offset');
			box-shadow: #{token('shadow.base')};
			color: token('color.ui.contrast.80');

			@include darkMode {
				background-color: token('color.ui.contrast.40');
				color: token('color.ui.contrast.90');
			}
		}
	}
</style>
