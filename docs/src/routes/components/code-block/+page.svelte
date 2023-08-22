<script lang="ts">
	import CodeBlock from '../../../../../src/code-block.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
import CodeBlock from '@terrazzo/tiles/code-block.svelte';
</script` +
		`>

<CodeBlock lang="shell" code="npm install @terrazzoapp/tiles" /` +
		`>`;
</script>

<svelte:head>
	<title>CodeBlock</title>
</svelte:head>

<div class="content">
	<h1>CodeBlock</h1>

	<p>A CodeBlock is good to use when showing code to a user. The code block syntax highlighting is powered by <a href="https://github.com/shikijs/shiki" target="_blank" rel="noopener noreferrer">Shiki</a>.</p>

	<h2>Example</h2>

	<Example {code}>
		<CodeBlock lang="shell" code="npm install @terrazzoapp/tiles" />
	</Example>
</div>
