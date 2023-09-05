<script lang="ts">
	import type { Oklch } from 'culori';
	import { clampChroma, formatCss, modeOklch, modeRgb, useMode } from 'culori/fn';
	import { onMount } from 'svelte';
	import ColorPicker from './color-picker.svelte';

	// props
	export let steps: Oklch[];

	// state
	useMode(modeOklch);
	const toRgb = useMode(modeRgb);
	let editingColor: number | undefined = undefined;

	// reactivity
	function cancelEditing() {
		editingColor = undefined;
	}
	$: safeColors = steps.map((c) => {
		const rgb = toRgb(c);
		return rgb ? formatCss(rgb) : formatCss(clampChroma(c, 'oklch'));
	});

	// lifecycle
	onMount(() => {
		function handleKeydown(evt: KeyboardEvent) {
			if (evt.key === 'Escape') {
				cancelEditing();
			}
		}

		addEventListener('keydown', handleKeydown);
		return () => removeEventListener('keydown', handleKeydown);
	});
</script>

<ol class="ramp">
	{#each safeColors as step, i}
		<li class="step" style:--background={formatCss(step)}>
			<button aria-label={`Edit Step ${i + 1}`} class="step-inspect" type="button" aria-expanded="false" on:click={() => (editingColor = i)}></button>
			{#if editingColor === i}
				<div class="step-detail-underlay" on:pointerdown={cancelEditing} />
				<div class="step-detail">
					<ColorPicker color={steps[i]} on:change={(evt) => (steps[i] = evt.detail)} />
				</div>
			{/if}
		</li>
	{/each}
</ol>

<style lang="scss">
	@use '../tokens' as *;

	.ramp {
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.step {
		background: var(--background);
		height: 3rem;
		margin: 0;
		padding: 0;
		position: relative;
		width: 4rem;

		&-detail {
			background-color: token('color.ui.bg-offset');
			border-radius: token('size.m.radius');
			left: calc(100% + token('size.m.padding'));
			top: 0;
			padding: token('size.m.padding');
			position: absolute;
			z-index: calc(token('layer.nav') + 1);

			&-underlay {
				height: 100%;
				left: 0;
				position: fixed;
				top: 0;
				width: 100%;
				z-index: token('layer.nav');
			}
		}

		&-inspect {
			-moz-appearance: none;
			-webkit-appearance: none;
			appearance: none;
			background: 0;
			cursor: pointer;
			border: 0;
			height: 100%;
			left: 0;
			overflow: hidden;
			padding: 0;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: token('layer.float');

			&::after {
				border: 0.5rem solid rgba(0, 0, 0, 0.2);
				content: '';
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				transform: scale(1.5);
				transition: transform token('timing.quick') token('ease.cubic-out');
				width: 100%;
			}

			&:hover::after {
				transform: scale(1);
			}
		}
	}
</style>
