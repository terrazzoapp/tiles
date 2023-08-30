<script lang="ts">
</script>

<div role="tablist" class="tablist">
	<slot />
</div>

<style lang="scss">
	@use '../tokens' as *;

	.tablist {
		box-shadow: inset 0 -1px solid token('color.ui.contrast.10');
		display: flex;
		gap: token('size.m.gap');
	}
</style>
