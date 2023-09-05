<script lang="ts" context="module">
	import { page } from '$app/stores';
	import '../styles/app.scss'; // global styles
</script>

<div class="layout">
	<aside class="sidebar">
		<a href="/"><img class="logo" src="/assets/terrazzo.svg" alt="Terrazzo" /></a>
		<nav class="nav">
			<ul>
				<li>
					<h3>Main</h3>
					<ul>
						<li><a href="/">Getting Started</a></li>
					</ul>
				</li>
				<li>
					<h3>Components</h3>
					<ul>
						<li><a href="/components/button" aria-current={$page.url.pathname === '/components/button' ? 'page' : undefined}>Button</a></li>
						<li><a href="/components/checkbox" aria-current={$page.url.pathname === '/components/checkbox' ? 'page' : undefined}>Checkbox</a></li>
						<li><a href="/components/code-block" aria-current={$page.url.pathname === '/components/code-block' ? 'page' : undefined}>CodeBlock</a></li>
						<li><a href="/components/color-picker" aria-current={$page.url.pathname === '/components/color-picker' ? 'page' : undefined}>ColorPicker</a></li>
						<li><a href="/components/color-ramp" aria-current={$page.url.pathname === '/components/color-ramp' ? 'page' : undefined}>ColorRamp</a></li>
						<li><a href="/components/input" aria-current={$page.url.pathname === '/components/input' ? 'page' : undefined}>Input</a></li>
						<li><a href="/components/radio" aria-current={$page.url.pathname === '/components/radio' ? 'page' : undefined}>Radio</a></li>
						<li><a href="/components/select" aria-current={$page.url.pathname === '/components/select' ? 'page' : undefined}>Select</a></li>
						<li><a href="/components/segmented-control" aria-current={$page.url.pathname === '/components/segmented-control' ? 'page' : undefined}>SegmentedControl</a></li>
						<li><a href="/components/slider" aria-current={$page.url.pathname === '/components/slider' ? 'page' : undefined}>Slider</a></li>
						<li><a href="/components/toggle" aria-current={$page.url.pathname === '/components/toggle' ? 'page' : undefined}>Toggle</a></li>
					</ul>
				</li>
			</ul>
		</nav>
	</aside>
	<main>
		<slot />
	</main>
</div>

<style lang="scss">
	@use '../../../tokens' as *;

	.layout {
		max-width: 90rem;
		margin-left: auto;
		margin-right: auto;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
		width: 100%;

		@media (min-width: 600px) {
			display: grid;
			grid-template-columns: 18rem auto;
			gap: 1.5rem;
		}
	}

	.logo {
		height: 3rem;
		width: 3rem;
	}

	.nav {
		@include typography('typography.base');

		padding-top: 1rem;

		h3 {
			font-size: token('size.m.textSize');
			font-weight: 300;
			opacity: 0.8;
			margin: 0;
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		li {
			padding: 0;

			ul {
				margin: 0.25rem 0 1rem;
			}
		}

		a {
			align-items: center;
			display: flex;
			height: 1.5rem;

			&[aria-current='page'] {
				color: inherit;
				text-decoration: none;
			}
		}
	}

	.sidebar {
		padding-top: 1.5rem;
	}
</style>
