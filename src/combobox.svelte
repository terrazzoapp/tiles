<script lang="ts" context="module">
	export interface Option {
		/** human-readable name */
		label: string;
		/** form value */
		value: string;
	}
</script>

<script lang="ts">
	import { nanoid } from 'nanoid';
	import { createEventDispatcher } from 'svelte';
	import { omit } from './lib/props.js';

	// props
	/** SR-accessible input label */
	export let label: string;
	/** (optional) autocomplete options */
	export let options: Option[] = [];
	export let id = `combobox-${nanoid(6)}`;
	/** (optional) allow freeform entry? (can only be `false` if options are provided) */
	export let freeform = true;
	export let value: Option[] = [];

	// state
	let isExpanded = false;
	let focusedOption: number | undefined = undefined;
	let searchValue = '';
	const dispatch = createEventDispatcher();

	// computed
	$: datalistID = `${id}-datalist`;
	$: sortedOptions = options.toSorted((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
	$: filteredOptions = sortedOptions.filter((o) => o.value.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())).slice(0, 10);

	// methods
	const optionID = (value: string) => `${id}-option-${value}`;
</script>

<div class="combobox">
	<label class="label" for={id}>{label}</label>
	<div class="field-wrapper">
		<input
			{...omit($$props, ['id', 'value'])}
			class="field"
			type="text"
			{id}
			role="combobox"
			bind:value={searchValue}
			aria-controls={datalistID}
			aria-autocomplete="list"
			aria-expanded={isExpanded}
			aria-activedescendant={typeof focusedOption === 'number' ? optionID(id, sortedOptions[focusedOption ?? -1]?.value) : undefined}
		/>
		<span aria-hidden="true" data-trigger="multiselect"></span>
		<ul id={datalistID} class="datalist" role="listbox" aria-label={label}>
			{#if searchValue}
				{#if filteredOptions.length}
					{#each filteredOptions as option, n}
						<li
							class="datalist-option"
							role="option"
							aria-selected={focusedOption === n}
							id={optionID(id, option.value)}
							on:click={() => {
								const next = new Set(value);
								next.add(option);
								dispatch('change', [...next]);
								searchValue = '';
							}}
						>
							{option.label}
						</li>
					{/each}
				{:else}
					<li class="datalist-noresults">No results for <mark>{searchValue}</mark></li>
				{/if}
			{/if}
		</ul>
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.combobox {
		--bg: #{token('color.ui.input.bg')};
		--borderColor: #{token('color.ui.input.border')};
		--gap: #{token('size.m.gap')};
		--height: #{token('size.m.height')};
		--padding: #{token('size.m.padding')};
		--textColor: #{token('color.ui.input.text')};
		--textSize: #{token('size.m.textSize')};

		color: var(--textColor);
		display: flex;
		flex-direction: column;
		font-variant-numeric: tabular-nums;
		gap: var(--gap);
		min-width: 0;
		position: relative;
		z-index: token('layer.base');
	}

	.datalist {
		background-color: var(--bg);
		border: 1px solid var(--borderColor);
		color: var(--textColor);
		display: block;
		list-style: none;
		margin: 0;
		max-width: 100%;
		padding: 0;
		position: absolute;
		width: 100%;
		z-index: token('layer.popover');
	}

	.datalist-option {
		cursor: pointer;
		display: block;
		height: var(--height);
		line-height: var(--height);
		padding-left: var(--padding);
		padding-right: var(--padding);
	}

	.field {
		-moz-appearance: textfield;
		-webkit-appearance: textfield;
		appearance: textfield;
		background: var(--bg);
		border: 1px solid var(--borderColor);
		border-radius: 0;
		color: var(--textColor);
		flex: 1 1 auto;
		font-variant-numeric: tabular-nums;
		font-size: var(--textSize);
		height: var(--height);
		max-width: 100%;
		min-width: 0;
		padding: 0 var(--gap) 0 0;
		text-indent: var(--gap);
		width: auto;
	}

	.label {
		@include typography('typography.label');

		color: token('color.ui.contrast.90');
		display: block;
		opacity: 0.75;

		&:empty {
			display: none;
		}
	}
</style>
