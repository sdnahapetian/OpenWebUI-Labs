<script lang="ts">
	import Fuse from 'fuse.js';
	import { getContext } from 'svelte';
	import { settings, WEBUI_NAME } from '$lib/stores';
	import { WEBUI_VERSION } from '$lib/constants';

	const i18n = getContext('i18n');

	export let suggestionPrompts = [];
	export let className = '';
	export let inputValue = '';
	export let onSelect = () => {};

	let sortedPrompts = [];

	const fuseOptions = {
		keys: ['content', 'title'],
		threshold: 0.5
	};

	let fuse;
	let filteredPrompts = [];

	$: fuse = new Fuse(sortedPrompts, fuseOptions);

	$: getFilteredPrompts(inputValue);

	function arraysEqual(a, b) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if ((a[i].id ?? a[i].content) !== (b[i].id ?? b[i].content)) {
				return false;
			}
		}
		return true;
	}

	const getFilteredPrompts = (inputValue) => {
		if (inputValue.length > 500) {
			filteredPrompts = [];
		} else {
			const newFilteredPrompts =
				inputValue.trim() && fuse
					? fuse.search(inputValue.trim()).map((result) => result.item)
					: sortedPrompts;

			if (!arraysEqual(filteredPrompts, newFilteredPrompts)) {
				filteredPrompts = newFilteredPrompts;
			}
		}
	};

	$: if (suggestionPrompts) {
		sortedPrompts = [...(suggestionPrompts ?? [])].sort(() => Math.random() - 0.5);
		getFilteredPrompts(inputValue);
	}
</script>

{#if filteredPrompts.length === 0}
	<div
		class="flex w-full {$settings?.landingPageMode === 'chat'
			? '-mt-1'
			: 'text-center items-center justify-center'} self-start text-xs font-normal"
		style="color: var(--bl-muted);"
	>
		<!-- LICENSE covers this Open WebUI footer identifier.
		Do not alter, remove, obscure, or replace it except as LICENSE permits:
		https://docs.openwebui.com/license. -->
		{$WEBUI_NAME} ‧ v{WEBUI_VERSION}
	</div>
{:else}
	<div role="list" class="w-full overflow-auto scrollbar-none {className}" style="gap: 10px;">
		{#each filteredPrompts as prompt, idx (prompt.id || `${prompt.content}-${idx}`)}
			<!-- svelte-ignore a11y-no-interactive-element-to-noninteractive-role -->
			<button
				role="listitem"
				class="waterfall"
				style="
					display: flex;
					align-items: center;
					gap: 10px;
					min-height: 52px;
					cursor: pointer;
					text-align: left;
					width: 100%;
					background: var(--bl-surface);
					border: 1px solid var(--bl-divider);
					border-radius: 999px;
					padding: 10px 18px;
					font-family: var(--bl-font-body);
					font-size: 15px;
					color: var(--bl-text);
					transition: background 120ms, transform 120ms;
					animation-delay: {idx * 45}ms;
				"
				on:mouseenter={(e) => {
					e.currentTarget.style.background = 'var(--bl-sage)';
					e.currentTarget.style.transform = 'translateY(-1px)';
				}}
				on:mouseleave={(e) => {
					e.currentTarget.style.background = 'var(--bl-surface)';
					e.currentTarget.style.transform = '';
				}}
				on:click={() => onSelect({ type: 'prompt', data: prompt.content })}
			>
				<span
					style="width: 8px; height: 8px; border-radius: 999px; flex-shrink: 0; background: var(--bl-accent);"
				></span>
				<div class="flex flex-col text-left leading-snug min-w-0">
					{#if prompt.title && prompt.title[0] !== ''}
						<div class="line-clamp-1" style="font-size: 14px;">
							{prompt.title[0]}
						</div>
						<div class="line-clamp-1" style="font-size: 12px; color: var(--bl-muted);">
							{prompt.title[1]}
						</div>
					{:else}
						<div class="line-clamp-1" style="font-size: 14px;">
							{prompt.content}
						</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>
{/if}

<style>
	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(6px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.waterfall {
		opacity: 0;
		animation-name: fadeInUp;
		animation-duration: 200ms;
		animation-fill-mode: forwards;
		animation-timing-function: ease;
	}
</style>
