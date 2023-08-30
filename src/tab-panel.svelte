<script lang="ts">
	import { getContext } from 'svelte';

	// props
	/** Unique ID for this tab */
	export let id: string;

	// reactivity
	$: elementID = `${id}-panel`;
	$: currentTab = getContext('currentTab');
</script>

<div class="tabpanel" role="tabpanel" id={elementID} hidden={currentTab === id ? undefined : true}><slot /></div>

<style lang="scss">
	@use '../tokens' as *;

	.tabpanel {
		display: block;

		&[hidden] {
			display: none;
		}
	}
</style>
