<script lang="ts">
	import CodeBlock from '../../../src/code-block.svelte';

	/** Example code to display */
	export let code: string;
</script>

<div class="example">
	<div class="playground"><slot /></div>
	<CodeBlock lang="svelte" {code} />
</div>

<style lang="scss">
	@use '../../../tokens' as *;

	.example {
		display: grid;
		gap: 1rem;
		max-width: 100%;

		@media (min-width: 600px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
