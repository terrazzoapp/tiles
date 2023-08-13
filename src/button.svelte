<script lang="ts">
	// props
	export let variant: "default" | "primary" = "default";
</script>

<button type="button" data-variant={variant}><slot /></button>

<style lang="scss">
	.button {
		background: none;
		border: 1px solid color-mix(in oklab, black, 50% transparent);
		color: inherit;
	}
</style>
