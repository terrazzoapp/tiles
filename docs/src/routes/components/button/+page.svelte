<script lang="ts">
	import Button from '../../../../../src/button.svelte';
	import Example from '../../../components/example.svelte';

	const code = `import Button from '@terrazzo/tiles/button.svelte';

<Button>Click me</Button>`;
</script>

<svelte:head>
	<title>Button</title>
</svelte:head>

<div class="content">
	<h1>Button</h1>

	<p>A button component is the simplest form of user input: clicking (or tapping) it should invoke one—and only one—action.</p>

	<h2>Example</h2>

	<Example {code}>
		<table>
			<thead>
				<tr>
					<th scope="col">&nbsp;</th>
					<th scope="col">size="m"</th>
					<th scope="col">size="s"</th>
					<th scope="col">size="l"</th>
				</tr>
			</thead>
			<tbody>
				{#each ['default', 'primary', 'error'] as variant}
					<tr>
						<th scope="row">variant="{variant}"</th>
						{#each ['m', 's', 'l'] as size}
							<td><Button {size} {variant}>{variant} ({size})</Button></td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</Example>
</div>

<style lang="scss">
	@use '../../../../../tokens' as *;

	th {
		@include typography('typography.mono');

		text-align: left;
		font-size: token('size.s.textSize');

		&[scope='row'] {
			padding-right: 1rem;
			vertical-align: middle;
		}

		&[scope='col'] {
			text-align: center;
			padding-bottom: 0.5;
		}
	}

	td {
		padding: 0.5rem;
	}
</style>
