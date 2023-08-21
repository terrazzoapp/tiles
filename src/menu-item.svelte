<script lang="ts">
	import { omit } from './lib/props.js';

	// props
	export let size: 's' | 'm' | 'l' = 'm';
</script>

<li {...omit($$props, ['size'])} role="menuitem" class="menu-item" data-size={size}>
	<slot />
</li>

<style lang="scss">
	@use '../tokens' as *;

	.menu-item {
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--radius: #{token('size.m.radius')};
		--textSize: #{token('size.m.textSize')};

		display: flex;
		font-family: token('typography.family.base');
		font-size: var(--textSize);
		min-height: var(--height);
		line-height: var(--height);
		padding: 0;

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

		:global(a),
		:global(button) {
			align-items: center;
			display: flex;
			gap: calc(0.75 * var(--padding));
			height: 100%;
			padding-left: var(--padding);
			padding-right: var(--padding);
		}

		&:first-of-type :global(a),
		&:first-of-type :global(button) {
			border-top-left-radius: var(--radius);
			border-top-right-radius: var(--radius);
		}

		&:last-of-type :global(a),
		&:last-of-type :global(button) {
			border-bottom-left-radius: var(--radius);
			border-bottom-right-radius: var(--radius);
		}
	}
</style>
