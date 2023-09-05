<script lang="ts">
	import { nanoid } from 'nanoid';
	import { omit } from './lib/props.js';

	// props
	export let label = '';
	export let id = `select-${nanoid(8)}`;
	export let name: string;
	export let options: { label: string; value: string }[];
</script>

<div class="select">
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
	<select {...omit($$props, ['class', 'label', 'id', 'options'])} {id} {name} class="field">
		{#each options ?? [] as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	@use '../tokens' as *;
</style>
