<script lang="ts">
	import Input from '../../input.svelte';

	let value = '';
</script>

<Input name="name" label="Text input" type="text" bind:value />
