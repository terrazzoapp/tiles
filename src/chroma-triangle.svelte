<script lang="ts">
	import type { Oklch } from 'culori';
	import { onMount } from 'svelte';
	import ChromaTriangle from './chroma-triangle.js';

	// actual max chroma displayed; this is theoretically at 0.4 but for sRGB spectrum is closer to 0.37
	const MAX_CHROMA = 0.4;

	// props
	export let hue: number;
	export let ramp: Oklch[];

	// state
	let canvasEl: HTMLCanvasElement | null = null;
	let webgl: ChromaTriangle | undefined = undefined;

	// reactivity
	$: sortedRamp = [...ramp].sort((a, b) => a.l - b.l);
	$: webgl?.setHue(hue);

	// lifecycle
	onMount(() => {
		webgl = new ChromaTriangle(canvasEl!, hue);
	});
</script>

<div class="chroma-triangle">
	<canvas class="canvas" bind:this={canvasEl} />
	<div class="dot-bounds">
		{#each sortedRamp as step}
			<div class="dot" style:--x={`${step.l * 100}%`} style:--y={`${(1 - step.c / MAX_CHROMA) * 100}%`} />
		{/each}
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.chroma-triangle {
		background-color: token('color.white');
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
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
