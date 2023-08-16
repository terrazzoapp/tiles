<menu {...$$props} class="actionBar"><slot /></menu>

<style lang="scss">
	@use '../tokens' as *;

	.actionBar {
		align-items: center;
		display: flex;
		gap: token('size.m.padding');
		justify-content: flex-end;
		margin: 0;
		padding: 0;
	}
</style>
