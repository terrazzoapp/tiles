<script lang="ts">
	import Input from '../../input.svelte';

	let value = '';
</script>

<Input name="date" label="Date input" type="date" bind:value />
