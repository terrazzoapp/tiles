<script lang="ts">
	import Radio from '../../radio.svelte';

	let move = 'Thunderbolt';
</script>

<Radio name="move" label="Thunderbolt" bind:group={move} value="Thunderbolt" />
<Radio name="move" label="Double Edge" bind:group={move} value="Double Edge" />
<Radio name="move" label="Agility" bind:group={move} value="Agility" />
<Radio name="move" label="Dig" bind:group={move} value="Dig" />

<pre><code>selected: {move}</code></pre>
