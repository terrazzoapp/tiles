<script lang="ts">
	import Checkbox from '../../checkbox.svelte';

	let group = ['Radishes', 'Potatoes'];
	let name = 'veg';
</script>

<Checkbox {name} label="Beets" bind:group value="Beets" />
<Checkbox {name} label="Carrots" bind:group value="Carrots" />
<Checkbox {name} label="Radishes" bind:group value="Radishes" />
<Checkbox {name} label="Potatoes" bind:group value="Potatoes" />

<pre><code>selected: {group}</code></pre>
