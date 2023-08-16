<script lang="ts">
	import Checkbox from '../../checkbox.svelte';

	let agree = true;
</script>

<Checkbox label="Agree" name="agree" bind:checked={agree} />

<pre><code>Agreed: {agree}</code></pre>
