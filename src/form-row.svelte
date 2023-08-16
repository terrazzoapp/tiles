<div {...$$props} class="formRow"><slot /></div>

<style lang="scss">
	@use '../tokens' as *;

	.formRow {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 0.5rem;
		padding-top: 0.5rem;
	}
</style>
