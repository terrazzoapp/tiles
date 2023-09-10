<script lang="ts">
	import Button from '../../../../../src/button.svelte';
	import Example from '../../../components/example.svelte';

	const code =
		`<script lang="ts"` +
		`>
  import Button from '@terrazzo/tiles/button.svelte';
</script` +
		`>

<Button` +
		`>Click me</Button` +
		`>`;

	const sizes = ['m', 's', 'l'] as const;
	const variants = ['default', 'primary', 'danger'] as const;
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
				{#each variants as variant}
					<tr>
						<th scope="row">variant="{variant}"</th>
						{#each sizes as size}
							<td><Button {size} {variant}><span class="button-name">{variant} ({size})</span></Button></td>
						{/each}
					</tr>
				{/each}
				<tr>
					<th scope="row">disabled</th>
					{#each sizes as size}
						<td><Button {size} disabled><span class="button-name">Disabled ({size})</span></Button></td>
					{/each}
				</tr>
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

	.button-name {
		text-transform: capitalize;
	}
</style>
