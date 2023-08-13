<script lang="ts">
	import Input from '../../input.svelte';

	let value = '';
</script>

<Input name="email" label="Email input" type="email" bind:value />
