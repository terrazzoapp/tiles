<script lang="ts">
	import type { Oklch } from 'culori';
	import { onMount } from 'svelte';
	import LightnessScale from './lib/lightness-scale.js';

	// props
	export let hue: number;
	export let chroma: number;
	export let ramp: Oklch[] = [];
	/** overlay a curve (default: undefined) */
	export let curve: [number, number, number, number] | undefined = undefined;

	// state
	let canvasEl: HTMLCanvasElement | null = null;
	let webgl: LightnessScale | undefined = undefined;

	// reactivity
	$: sortedRamp = [...ramp].sort((a, b) => a.l - b.l);
	$: webgl?.setColor(chroma, hue);

	// lifecycle
	onMount(() => {
		webgl = new LightnessScale(canvasEl!, chroma, hue);
	});
</script>

<div class="lightness-scale">
	<canvas class="canvas" bind:this={canvasEl} />
	{#if curve}
		<svg class="curve" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
			><path class="curve-line" d={`M0 100C${100 * curve[0]} ${100 * (1 - curve[1])},${100 * curve[2]} ${100 * (1 - curve[3])},100 0`}></path></svg
		>
	{/if}
	<div class="dot-bounds">
		{#each sortedRamp as step, i}
			<div class="dot" style:--x={`${(i / (ramp.length - 1)) * 100}%`} style:--y={`${(1 - step.l) * 100}%`} />
		{/each}
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.lightness-scale {
		--padding: 1.5rem;

		background-color: token('color.ui.contrast.20');
		border-radius: token('size.m.radius');
		min-height: 12rem;
		position: relative;
		width: 100%;
	}

	.canvas {
		border-radius: token('size.m.radius');
		height: 100%;
		position: absolute;
		width: 100%;
	}

	.curve {
		fill: none;
		height: 100%;
		left: var(--padding);
		pointer-events: none;
		position: absolute;
		top: 0;
		width: calc(100% - 2 * var(--padding));

		&-line {
			stroke: rgba(0, 0, 0, 0.5);
			stroke-width: 0.75;
		}
	}

	.dot {
		background: token('color.gray.100');
		border-radius: 50%;
		border: 2px solid token('color.gray.10');
		height: 1rem;
		left: var(--x);
		position: absolute;
		top: var(--y);
		transform: translate3d(-50%, -50%, 0);
		width: 1rem;
		z-index: token('layer.float');
	}

	.dot-bounds {
		bottom: 0;
		left: var(--padding);
		position: absolute;
		right: var(--padding);
		top: 0;
	}
</style>
