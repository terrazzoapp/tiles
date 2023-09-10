<script lang="ts">
	import { nanoid } from 'nanoid';
	import { createEventDispatcher } from 'svelte';
	import { omit } from './lib/props.js';

	// props
	export let label = '';
	export let id = `select-${nanoid(8)}`;
	export let name: string;
	export let options: { label: string; value: string }[];
	export let value: any; // eslint-disable-line @typescript-eslint/no-explicit-any

	// state
	const dispatch = createEventDispatcher();

	// reactivity
	function handleChange(evt: Event) {
		value = (evt.target as HTMLSelectElement).value;
		dispatch('change', value);
	}
</script>

<div class="select">
	<label class="label" for={id}
		>{#if $$slots.label}<slot name="label" />{:else}{label}{/if}</label
	>
	<select {...omit($$props, ['class', 'label', 'id', 'options', 'value'])} {id} {name} class="field" {value} on:change={handleChange}>
		{#each options ?? [] as option}
			<option selected={option.value === value} value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	@use '../tokens' as *;
</style>
