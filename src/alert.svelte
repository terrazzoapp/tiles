<script lang="ts">
	import { omit } from './lib/props.js';

	/** the alert type */
	export let type: 'info' | 'success' | 'warn' | 'error' = 'info';
</script>

<div {...omit($$props, ['type'])} class="alert" role="alert" data-type={type}><slot /></div>

<style lang="scss">
	@use '../tokens' as *;

	.alert {
		@include typography('typography.base');

		--background: #{token('color.ui.action.bg')};
		--color: #{token('color.ui.action.text')};
		--border: #{token('color.ui.action.border')};

		border: 1px solid var(--border);
		background: var(--background);
		color: var(--color);
		border-radius: token('size.m.radius');
		padding: token('size.m.padding');

		// types

		&[data-type='error'] {
			--background: #{token('color.ui.error.bg')};
			--color: #{token('color.ui.error.text')};
			--border: #{token('color.ui.error.border')};
		}

		&[data-type='warn'] {
			--background: #{token('color.ui.warn.bg')};
			--color: #{token('color.ui.warn.text')};
			--border: #{token('color.ui.warn.border')};
		}

		&[data-type='success'] {
			--background: #{token('color.ui.success.bg')};
			--color: #{token('color.ui.success.text')};
			--border: #{token('color.ui.success.border')};
		}
	}
</style>
