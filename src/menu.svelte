<menu {...$$props} class="menu">
	<slot />
</menu>

<style lang="scss">
	@use '../tokens' as *;

	.menu {
		background-color: token('color.ui.bg-offset');
		box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
		border-radius: token('size.m.radius');
		margin: 0;
		padding: 0;
	}
</style>
