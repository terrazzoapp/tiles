<script lang="ts">
	import { getContext, setContext } from 'svelte';

	// props
	/** unique ID for this tab */
	export let id: string;
	export let size: 's' | 'm' | 'l' = 'm';

	// reactivity
	function handleClick() {
		setContext('currentTab', id);
	}

	$: currentTab = getContext('currentTab');
	$: panelID = `${id}-panel`;
</script>

<li class="tab" data-size={size}><button class="tab-button" role="tab" {id} type="button" aria-controls={panelID} aria-selected={currentTab === id} on:click={handleClick}><slot /></button></li>

<style lang="scss">
	@use '../tokens' as *;

	.tab {
		list-style: none;
		margin: 0;
		padding: 0;

		&-button {
			--gap: #{token('size.m.gap')};
			--height: #{token('size.m.height')};
			--textSize: #{token('size.m.textSize')};

			@include typography('typography.base');

			-moz-appearance: none;
			-webkit-appearance: none;
			align-items: center;
			background: none;
			border-bottom: 2px solid transparent;
			border-radius: 0;
			color: token('color.ui.fg');
			cursor: pointer;
			display: flex;
			font-size: var(--textSize);
			gap: var(--gap);
			height: var(--height);
			padding: 0;
			line-height: var(--height);

			&[aria-selected='true'] {
				border-bottom-color: token('color.ui.action.base');
			}

			.tab[data-size='s'] & {
				--gap: #{token('size.s.gap')};
				--height: #{token('size.s.height')};
				--textSize: #{token('size.s.textSize')};
			}

			.tab[data-size='l'] & {
				--gap: #{token('size.l.gap')};
				--height: #{token('size.l.height')};
				--textSize: #{token('size.l.textSize')};
			}
		}
	}
</style>
