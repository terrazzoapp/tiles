<script lang="ts">
	import type { Oklch } from 'culori';
	import { clampChroma, formatRgb, modeOkhsv, modeOklch, modeRgb, useMode } from 'culori/fn';
	import { onMount } from 'svelte';
	import ColorPicker from './color-picker.svelte';

	const L_STEP = 0.005;
	const S_STEP = 0.005;

	// props
	/** array of Oklch colors to display */
	export let steps: Oklch[];
	/** set to `false` to disable editing */
	export let editable = true;

	// state
	const toOklch = useMode(modeOklch);
	const toOkhsv = useMode(modeOkhsv);
	const toRgb = useMode(modeRgb);
	let rootEl: HTMLOListElement | null = null;
	let pickerEl: HTMLDivElement | null = null;
	let editingColor: number | undefined = undefined;

	// reactivity
	function cancelEditing() {
		editingColor = undefined;
	}
	function updateV(step: number, amount = L_STEP) {
		if (!editable || !steps[step]) {
			return;
		}
		const hsv = toOkhsv(steps[step]!);
		steps[step]! = clampChroma(toOklch({ ...hsv, v: hsv.v + amount }), 'oklch');
		pickerEl?.querySelector<HTMLDivElement>('.svelte-color-select')?.focus(); // move keyboard focus to picker for add’l keyboard controls
	}
	function updateS(step: number, amount = S_STEP) {
		if (!editable || !steps[step]) {
			return;
		}
		const hsv = toOkhsv(steps[step]!);
		steps[step]! = clampChroma(toOklch({ ...hsv, s: hsv.s + amount }), 'oklch');
		pickerEl?.querySelector<HTMLDivElement>('.svelte-color-select')?.focus(); // move keyboard focus to picker for add’l keyboard controls
	}
	function handleKeyUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			cancelEditing();
		}
	}
	function handleKeydown(evt: KeyboardEvent) {
		if (typeof editingColor !== 'number') {
			return;
		}
		if ((evt.altKey && (evt.key === 'ArrowUp' || evt.key === 'ArrowDown')) || evt.key === 'Tab') {
			evt.preventDefault();
			let nextEditingColor = editingColor;
			if (evt.key === 'Tab') {
				nextEditingColor = evt.shiftKey ? editingColor - 1 : editingColor + 1;
			} else {
				nextEditingColor = evt.key === 'ArrowUp' ? editingColor - 1 : editingColor + 1;
			}
			if (nextEditingColor >= steps.length) {
				nextEditingColor = 0;
			} else if (nextEditingColor < 0) {
				nextEditingColor = steps.length - 1;
			}
			editingColor = nextEditingColor;
		}
	}
	$: safeColors = steps.map((c) => {
		return formatRgb(toRgb(c) ? c : clampChroma(c, 'oklch'));
	});
	$: {
		if (typeof editingColor === 'number' && rootEl) {
			(rootEl.querySelectorAll('.step-inspect')[editingColor] as HTMLButtonElement | undefined)?.focus();
		}
	}

	// lifecycle
	onMount(() => {
		addEventListener('keyup', handleKeyUp);
		return () => {
			removeEventListener('keyup', handleKeyUp);
		};
	});
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<ol class="ramp" bind:this={rootEl} data-editable={editable} data-is-editing={typeof editingColor === 'number'} on:keydown={handleKeydown}>
	{#each safeColors as step, i}
		<li class="step" style:--background={formatRgb(step)}>
			<button aria-label={`Edit Step ${i + 1}`} class="step-inspect" type="button" aria-expanded={editingColor === i} on:click={() => (editingColor = i)} on:keydown={handleKeydown}></button>
			{#if editingColor === i}
				<div class="step-detail-underlay" on:pointerdown={cancelEditing} />
				<menu class="step-adjustments">
					<button type="button" tabindex="-1" class="step-adjust step-adjust--l-up" on:click={() => updateV(i, L_STEP)}
						><svg class="icon icon--plus" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path
								d="M11,20 C11,20.5523 11.4477,21 12,21 C12.5523,21 13,20.5523 13,20 L13,13 L20,13 C20.5523,13 21,12.5523 21,12 C21,11.4477 20.5523,11 20,11 L13,11 L13,4 C13,3.44772 12.5523,3 12,3 C11.4477,3 11,3.44772 11,4 L11,11 L4,11 C3.44772,11 3,11.4477 3,12 C3,12.5523 3.44772,13 4,13 L11,13 L11,20 Z"
							></path></svg
						></button
					>
					<button type="button" tabindex="-1" class="step-adjust step-adjust--c-up" on:click={() => updateS(i, S_STEP)}
						><svg class="icon icon--plus" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path
								d="M11,20 C11,20.5523 11.4477,21 12,21 C12.5523,21 13,20.5523 13,20 L13,13 L20,13 C20.5523,13 21,12.5523 21,12 C21,11.4477 20.5523,11 20,11 L13,11 L13,4 C13,3.44772 12.5523,3 12,3 C11.4477,3 11,3.44772 11,4 L11,11 L4,11 C3.44772,11 3,11.4477 3,12 C3,12.5523 3.44772,13 4,13 L11,13 L11,20 Z"
							></path></svg
						></button
					>
					<button type="button" tabindex="-1" class="step-adjust step-adjust--l-down" on:click={() => updateV(i, -L_STEP)}
						><svg class="icon icon--minus" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path d="M3,12 C3,11.4477 3.44772,11 4,11 L20,11 C20.5523,11 21,11.4477 21,12 C21,12.5523 20.5523,13 20,13 L4,13 C3.44772,13 3,12.5523 3,12 Z"></path></svg
						></button
					>
					<button type="button" tabindex="-1" class="step-adjust step-adjust--c-down" on:click={() => updateS(i, -S_STEP)}
						><svg class="icon icon--minus" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path d="M3,12 C3,11.4477 3.44772,11 4,11 L20,11 C20.5523,11 21,11.4477 21,12 C21,12.5523 20.5523,13 20,13 L4,13 C3.44772,13 3,12.5523 3,12 Z"></path></svg
						></button
					>
				</menu>
				<div class="step-detail" bind:this={pickerEl}>
					<ColorPicker
						color={steps[i]}
						on:change={(evt) => {
							if (editable) {
								steps[i] = evt.detail;
								steps = steps;
							}
						}}
					/>
				</div>
			{/if}
		</li>
	{/each}
</ol>

<style lang="scss">
	@use '../tokens' as *;
	@use './styles/util' as *;

	.ramp {
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.step {
		--checker-size: 1rem;
		--checker-color-1: #{token('color.ui.contrast.30')};
		--checker-color-2: transparent;

		// https://css-tricks.com/background-patterns-simplified-by-conic-gradients/#checkerboard
		background-color: var(--checker-color-2);
		background-image: linear-gradient(45deg, var(--checker-color-1) 25%, transparent 25%, transparent 75%, var(--checker-color-1) 75%, var(--checker-color-1)),
			linear-gradient(45deg, var(--checker-color-1) 25%, transparent 25%, transparent 75%, var(--checker-color-1) 75%, var(--checker-color-1));
		background-size: var(--checker-size) var(--checker-size);
		background-position:
			0 0,
			calc(var(--checker-size) / 2) calc(var(--checker-size) / 2);
		height: 3rem;
		margin: 0;
		padding: 0;
		position: relative;
		width: 4rem;

		&-adjustments {
			height: 100%;
			left: 0;
			margin: 0;
			padding: 0;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: calc(token('layer.nav') + 3);

			.ramp[data-editable='false'] & {
				display: none;
			}
		}

		&-adjust {
			align-items: center;
			border: none;
			background-color: token('color.ui.bg-offset');
			color: token('color.ui.contrast.50');
			cursor: pointer;
			display: flex;
			height: 2rem;
			justify-content: center;
			padding: 0;
			position: absolute;
			transition: transform token('transition.base');
			width: 2rem;
			z-index: calc(token('layer.nav') + 1);

			@include darkMode {
				background-color: token('color.ui.contrast.40');
				color: token('color.ui.contrast.80');
			}

			&:hover,
			&:focus-visible {
				color: token('color.ui.contrast.70');
			}

			&--c-down {
				border-radius: 8rem 0 0 8rem;
				padding-right: 0.375rem;
				right: 100%;
				top: 50%;
				transform: translate3d(25%, -50%, 0);

				&:hover {
					transform: translate3d(12.5%, -50%, 0);
				}
			}

			&--c-up {
				border-radius: 0 8rem 8rem 0;
				left: 100%;
				padding-left: 0.375rem;
				top: 50%;
				transform: translate3d(-25%, -50%, 0);

				&:hover {
					transform: translate3d(-12.5%, -50%, 0);
				}
			}

			&--l-down {
				border-radius: 0 0 8rem 8rem;
				left: 50%;
				padding-top: 0.375rem;
				top: 100%;
				transform: translate3d(-50%, -25%, 0);

				&:hover {
					transform: translate3d(-50%, -12.5%, 0);
				}
			}

			&--l-up {
				border-radius: 8rem 8rem 0 0;
				bottom: 100%;
				left: 50%;
				padding-bottom: 0.375rem;
				transform: translate3d(-50%, 25%, 0);

				&:hover {
					transform: translate3d(-50%, 12.5%, 0);
				}
			}
		}

		&-detail {
			background-color: token('color.ui.bg-offset');
			border-radius: token('size.m.radius');
			box-shadow: token('shadow.base');
			left: calc(100% + token('size.m.padding'));
			top: 0;
			padding: token('size.m.padding');
			position: absolute;
			z-index: calc(token('layer.nav') + 2);

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
			background: var(--background);
			border: none;
			border-radius: 0;
			cursor: pointer;
			border: 0;
			height: 100%;
			left: 0;
			outline: none;
			overflow: hidden;
			padding: 0;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: token('layer.float');

			.ramp[data-is-editing='true'] & {
				z-index: calc(token('layer.nav') + 2);

				&[aria-expanded='true'] {
					z-index: calc(token('layer.nav') + 5);
				}
			}

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

	.icon {
		display: block;
		fill: currentColor;
		height: 0.75rem;
		width: 0.75rem;
	}
</style>
