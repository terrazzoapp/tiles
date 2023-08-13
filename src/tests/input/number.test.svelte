<script lang="ts">
	import Input from '../../input.svelte';

	let value = 0;
</script>

<Input name="digit" label="Number input" type="number" min="0" max="100" bind:value />
