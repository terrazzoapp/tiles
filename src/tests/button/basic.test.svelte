<script lang="ts">
	import Button from '../../button.svelte';

	export let color: any = 'default';
	export let size: any = 'm';
</script>

<Button {size} {color}>Click me</Button>
