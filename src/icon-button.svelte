<script lang="ts">
	import { omit } from './lib/props.js';

	// props
	/** button size variant */
	export let size: 's' | 'm' | 'l' = 'm';
	/** button type */
	export let type: 'button' | 'submit' = 'button';
	/** href (only use if button is a link) */
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a {...omit($$props, ['color', 'href', 'size', 'type', 'variant'])} {href} class="button" {type} data-size={size}><slot /></a>
{:else}
	<button {...omit($$props, ['color', 'size', 'type', 'variant'])} class="button" {type} data-size={size}><slot /></button>
{/if}

<style lang="scss">
	@use '../tokens' as *;

	.button {
		--height: #{token('size.m.height')};
		--iconSize: #{token('size.m.textSize')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};
		--textColor: #{color('color.ui.fg')};
		--borderColor: color-mix(in oklab, currentColor, 60% transparent);

		@include typography('typography.base');

		align-items: center;
		background: none;
		border-color: var(--borderColor);
		border-radius: var(--radius);
		border-style: solid;
		border-width: 1px;
		color: var(--textColor);
		cursor: pointer;
		display: inline-flex;
		font-size: var(--textSize);
		gap: var(--padding);
		height: var(--height);
		line-height: var(--height);
		padding-bottom: 0;
		padding-left: var(--padding);
		padding-right: var(--padding);
		padding-top: 0;
		text-decoration: none;
		white-space: nowrap;

		:global(svg) {
			height: var(--iconSize);
			width: var(--iconSize);
		}

		// sizes

		&[data-size='s'] {
			--height: #{token('size.s.height')};
			--iconSize: #{token('size.s.textSize')};
			--padding: #{token('size.s.padding')};
			--radius: #{token('size.s.radius')};
		}

		&[data-size='l'] {
			--height: #{token('size.l.height')};
			--iconSize: #{token('size.l.textSize')};
			--padding: #{token('size.l.padding')};
			--radius: #{token('size.m.radius')};
		}

		// states
		&[aria-selected='true'] {
			--background: background-color: token('color.ui.contrast.30');
		}

		&[disabled] {
			--borderColor: #{token('color.ui.contrast.15')};
			--textColor: #{token('color.ui.contrast.40')};

			background: #{token('color.ui.contrast.15')};
			cursor: default;

			&:hover {
				--borderColor: #{token('color.ui.contrast.15')};
			}
		}
	}
</style>
