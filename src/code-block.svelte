<script lang="ts" context="module">
	export interface ShikiOptions {
		/** Set Shiki themes and preloaded langs */
		highlighter: shikiJS.HighlighterOptions;
		/** Shiki CDN root (default: "/assets/shiki") */
		cdn?: string;
	}

	export const SHIKI_DEFAULT_THEME: shikiJS.Theme = 'material-theme-palenight';
	export const SHIKI_DEFAULT_LANGS: shikiJS.Lang[] = ['bash', 'html', 'css', 'shell', 'javascript', 'svelte'];
	export const SHIKI_LINES_RE = /<\s*span\s+class="line"/g;
	export const SHIKI_ROOT_STYLE_RE = /style="([^"]+)/;

	/**
	 * global cached shiki highlighters
	 * this should stay at the module level so instances can share one cache
	 */
	export const cachedHighlighters = new Map<string, shikiJS.Highlighter>();
</script>

<script lang="ts">
	import * as shikiJS from 'shiki';
	import Button from './button.svelte';
	import { omit } from './lib/props.js';

	// props

	/** highlighted code to display */
	export let code: string;
	/** code language */
	export let lang: shikiJS.Lang | undefined;
	/** show line numbers? (default: `false`) */
	export let lineNumbers = false;
	/** edit if line numbers don’t start at `1` */
	export let startingLineNumber = 1;
	/** show copy button? (default: `true`) */
	export let showCopy = true;
	/** copy text (default: 'copy') */
	export let copyText = 'copy';
	/** copied text (default: 'copied') */
	export let copiedText = 'copied';
	/** “copied” text duration in milliseconds (default: `2000`) */
	export let copiedDuration = 2000;
	/** configure Shiki */
	export let shiki: ShikiOptions = {
		highlighter: {
			theme: SHIKI_DEFAULT_THEME,
			langs: SHIKI_DEFAULT_LANGS,
		},
		cdn: '/assets/shiki',
	};

	// state
	let highlighter: shikiJS.Highlighter | undefined;
	let copyMessage = copyText;
	let copyTimeout: number;

	// methods
	function handleCopy(): void {
		console.log({ code });
		if (!code) return;
		clearTimeout(copyTimeout);
		navigator.clipboard.writeText(code).then(() => {
			copyMessage = copiedText;
			copyTimeout = setTimeout(() => {
				copyMessage = copyText;
			}, copiedDuration);
		});
	}

	// reactivity
	$: highlighterID = JSON.stringify({ theme: shiki?.highlighter?.theme ?? SHIKI_DEFAULT_THEME, langs: shiki?.highlighter?.langs ?? SHIKI_DEFAULT_LANGS }); // not perfect, but this is serializable enough to work for most cases
	$: {
		shikiJS.setCDN(shiki?.cdn ?? '/assets/shiki');
	}
	$: {
		if (!highlighter) {
			if (cachedHighlighters.has(highlighterID)) {
				highlighter = cachedHighlighters.get(highlighterID);
			} else {
				shikiJS.getHighlighter({ theme: SHIKI_DEFAULT_THEME, langs: SHIKI_DEFAULT_LANGS, ...shiki.highlighter }).then((h) => {
					highlighter = h;
					cachedHighlighters.set(highlighterID, h);
				});
			}
		}
	}
	$: codeHtml = highlighter ? highlighter.codeToHtml(code, { lang }) : undefined;
	$: lineMatches = codeHtml ? codeHtml.match(SHIKI_LINES_RE) : null;
	$: lineCount = lineMatches ? lineMatches.length : 0;
	$: rootStyleMatch = codeHtml ? codeHtml.match(SHIKI_ROOT_STYLE_RE) : null;
	$: rootStyle = rootStyleMatch?.[1];
</script>

<div class="code" style={`--pocky-code-starting-line-no:${startingLineNumber}`}>
	{#if showCopy}
		<div class="code-menu" role="menu"><Button size="s" on:click={handleCopy}>{copyMessage}</Button></div>
	{/if}
	<div class="code-window">
		{#if lineNumbers}
			<div class="code-linenumbers" style={rootStyle}>
				{#each Array(lineCount) as _, i}<div class="code-linenumber">{startingLineNumber + i}</div>{/each}
			</div>
		{/if}
		<div class="code-code" {...omit($$props, ['code', 'copiedDuration', 'copiedText', 'copyText', 'lang', 'lineNumbers', 'showCopy', 'shiki', 'startingLineNumber'])}>
			{#if codeHtml}{@html codeHtml}{:else}<pre><code>{code}</code></pre>{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.code {
		@include typography('typography.mono');

		border-radius: token('size.s.radius');
		color: token('color.white');
		display: flex;
		max-width: 100%;
		overflow: hidden;
		position: relative;

		:global(.shiki) {
			font-size: token('size.s.textSize');
			margin: 0;
			padding: token('size.m.padding');
			width: 100%;
		}

		// subcomponents

		&-code {
			box-sizing: border-box;
			display: flex;
			overflow-x: auto;
			width: 100%;
		}

		&-inner {
			padding-right: token('size.s.padding');
		}

		&-linenumber {
			opacity: 0.5;
		}

		&-linenumbers {
			padding-left: token('size.m.padding');
			padding-top: token('size.m.padding');
			text-align: right;
		}

		&-menu {
			right: 0.75rem;
			top: 0.75rem;
			position: absolute;
		}

		&-window {
			display: flex;
			width: 100%;
		}
	}
</style>
