<script lang="ts">
	import { omit } from './lib/props.js';

	// props
	/** button color variant */
	export let variant: 'default' | 'primary' | 'danger' = 'default';
	/** button size variant */
	export let size: 's' | 'm' | 'l' = 'm';
	/** button type */
	export let type: 'button' | 'submit' = 'button';
	/** href (only use if button is a link) */
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a {...omit($$props, ['color', 'href', 'size', 'type', 'variant'])} {href} class="button" {type} data-variant={variant} data-size={size}><slot /></a>
{:else}
	<button {...omit($$props, ['color', 'size', 'type', 'variant'])} class="button" {type} data-variant={variant} data-size={size}><slot /></button>
{/if}

<style lang="scss">
	@use '../tokens' as *;

	.button {
		--background: #{token('color.ui.bg')};
		--gap: #{token('size.l.gap')};
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};
		--textColor: #{color('color.ui.fg')};
		--textSize: #{token('size.m.textSize')};
		--borderColor: color-mix(in oklab, currentColor, 60% transparent);

		@include typography('typography.base');

		align-items: center;
		background: var(--background);
		border-color: var(--borderColor);
		border-radius: var(--radius);
		border-style: solid;
		border-width: 1px;
		color: var(--textColor);
		cursor: pointer;
		display: inline-flex;
		font-size: var(--textSize);
		font-variation-settings: 'opsz' 12;
		gap: var(--gap);
		height: var(--height);
		justify-content: center;
		line-height: var(--height);
		padding-bottom: 0;
		padding-left: var(--padding);
		padding-right: var(--padding);
		padding-top: 0;
		text-decoration: none;
		white-space: nowrap;

		:global(svg) {
			height: 1rem;
			width: 1rem;
		}

		// variants

		&[data-variant='default'] {
			&:hover {
				--borderColor: color-mix(in oklab, currentColor, 40% transparent);
			}
		}

		&[data-variant='primary'] {
			--background: #{token('color.ui.action.base')};
			--borderColor: #{token('color.ui.action.base')};
			--textColor: #{token('color.white')};

			&:active {
				--background: #{token('color.ui.action.text')};
			}
		}

		&[data-variant='danger'] {
			--background: #{token('color.ui.error.base')};
			--borderColor: #{token('color.ui.error.base')};
			--textColor: #{token('color.white')};

			&:active {
				--background: #{token('color.ui.error.text')};
			}
		}

		// sizes

		&[data-size='s'] {
			--gap: #{token('size.l.gap')};
			--height: #{token('size.s.height')};
			--padding: #{token('size.s.padding')};
			--radius: #{token('size.s.radius')};
			--textSize: #{token('size.s.textSize')};

			font-variation-settings: 'wght' 500;
		}

		&[data-size='l'] {
			--gap: #{token('size.l.gap')};
			--height: #{token('size.l.height')};
			--padding: #{token('size.l.padding')};
			--radius: #{token('size.m.radius')};
			--textSize: #{token('size.l.textSize')};

			font-variation-settings: 'wght' 375;
		}

		&[disabled] {
			--background: #{token('color.ui.contrast.15')};
			--borderColor: #{token('color.ui.contrast.15')};
			--textColor: #{token('color.ui.contrast.40')};

			cursor: default;

			&:hover {
				--borderColor: #{token('color.ui.contrast.15')};
			}

			&:active {
				--background: #{token('color.ui.contrast.15')};
			}
		}
	}
</style>
