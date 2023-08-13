<script lang="ts">
	import { omit } from './lib/props.js';

	// props
	/** button color variant */
	export let variant: 'default' | 'primary' = 'default';
	/** button size variant */
	export let size: 's' | 'm' | 'l' = 'm';
	/** button type */
	export let type: 'button' | 'submit' = 'button';
</script>

<button {...omit($$props, ['color', 'size', 'type', 'variant'])} class="button" {type} data-variant={variant} data-size={size}><slot /></button>

<style lang="scss">
	@use '../tokens' as *;

	.button {
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};
		--textSize: #{token('size.m.textSize')};

		@include typography('typography.base');

		align-items: center;
		background: none;
		border: 1px solid color-mix(in oklab, currentColor, 50% transparent);
		border-radius: var(--radius);
		color: inherit;
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
		white-space: nowrap;

		&[data-size='s'] {
			--height: #{token('size.s.height')};
			--padding: #{token('size.s.padding')};
			--radius: #{token('size.s.radius')};
			--textSize: #{token('size.s.textSize')};
		}

		&[data-size='m'] {
			--height: #{token('size.m.height')};
			--padding: #{token('size.m.padding')};
			--radius: #{token('size.m.radius')};
			--textSize: #{token('size.m.textSize')};
		}
	}
</style>
