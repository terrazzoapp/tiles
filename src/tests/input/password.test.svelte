<script lang="ts">
	import Input from '../../input.svelte';

	let value = '';
</script>

<Input name="password" label="Password input" type="password" bind:value />
