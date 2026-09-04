<script lang="ts">
	import { WEBUI_API_BASE_URL, WEBUI_BASE_URL } from '$lib/constants';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	import { config, user, models as _models, temporaryChatEnabled } from '$lib/stores';
	import { onMount, getContext } from 'svelte';

	import { blur, fade } from 'svelte/transition';

	import Suggestions from './Suggestions.svelte';
	import { sanitizeResponseContent } from '$lib/utils';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import EyeSlash from '$lib/components/icons/EyeSlash.svelte';

	const i18n = getContext('i18n');

	export let modelIds = [];
	export let models = [];
	export let atSelectedModel;

	export let onSelect = (e) => {};

	let mounted = false;
	let selectedModelIdx = 0;

	$: if (modelIds.length > 0) {
		selectedModelIdx = models.length - 1;
	}

	$: models = modelIds.map((id) => $_models.find((m) => m.id === id));

	onMount(() => {
		mounted = true;
	});
</script>

{#key mounted}
	<div class="m-auto w-full max-w-[58rem] px-8 lg:px-20">
		<div class="flex justify-start">
			<div class="flex -space-x-4 mb-0.5" in:fade={{ duration: 200 }}>
				{#each models as model, modelIdx}
					<button
						on:click={() => {
							selectedModelIdx = modelIdx;
						}}
					>
						<Tooltip
							content={DOMPurify.sanitize(
								marked.parse(
									sanitizeResponseContent(
										models[selectedModelIdx]?.info?.meta?.description ?? ''
									).replaceAll('\n', '<br>')
								)
							)}
							placement="right"
						>
							<img
								src={`${WEBUI_API_BASE_URL}/models/model/profile/image?id=${model?.id}&lang=${$i18n.language}`}
								class=" size-[2.7rem] rounded-full"
								alt="logo"
								draggable="false"
								on:error={(e) => {
									// LICENSE covers this Open WebUI fallback logo.
									// Do not alter, remove, obscure, or replace it except as LICENSE permits:
									// https://docs.openwebui.com/license.
									e.currentTarget.src = '/favicon.png';
								}}
							/>
						</Tooltip>
					</button>
				{/each}
			</div>
		</div>

		{#if $temporaryChatEnabled}
			<Tooltip
				content={$i18n.t("This chat won't appear in history and your messages will not be saved.")}
				className="w-full flex justify-start mb-0.5"
				placement="top"
			>
				<div class="flex items-center gap-1.5 text-gray-500 text-xs mt-1 w-fit">
					<EyeSlash strokeWidth="2" className="size-3.5" />{$i18n.t('Temporary Chat')}
				</div>
			</Tooltip>
		{/if}

		<!-- Bug Lab greeting card -->
		<div class="mt-2 mb-4 text-left" in:fade={{ duration: 200 }}>
			<div style="display: flex; gap: 14px; align-items: flex-start;">
				<svg
					viewBox="0 0 40 40"
					style="width: 44px; height: 44px; flex-shrink: 0; display: block;"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
				>
					<ellipse cx="20" cy="23" rx="13" ry="14" fill="#c0392b" />
					<circle cx="20" cy="9" r="7" fill="#201e1d" />
					<rect x="19" y="10" width="2" height="26" fill="#201e1d" />
					<circle cx="13" cy="19" r="2.6" fill="#201e1d" />
					<circle cx="27" cy="19" r="2.6" fill="#201e1d" />
					<circle cx="14" cy="28" r="2.2" fill="#201e1d" />
					<circle cx="26" cy="28" r="2.2" fill="#201e1d" />
				</svg>
				<div
					style="background: var(--bl-card); border: 1px solid var(--bl-divider); border-radius: 28px; padding: 20px 24px; box-shadow: 0 3px 10px rgba(46,43,37,0.16);"
				>
					<h2
						style="font-family: var(--bl-font-heading); font-size: 28px; line-height: 1.12; margin: 0 0 6px; color: var(--bl-text); letter-spacing: -0.015em;"
					>
						Hi {$user?.name}! I'm {models[selectedModelIdx]?.name || 'Dot'}.
					</h2>
					<p style="font-size: 17px; margin: 0 0 16px; color: var(--bl-muted);">
						Ask me anything and I'll help you find out.
					</p>
					<div
						style="background: var(--bl-sage); border: 1px solid var(--bl-sage-border); border-radius: 14px; padding: 14px 16px;"
					>
						<div
							style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bl-sage-text); margin-bottom: 5px;"
						>
							Bug fact of the day
						</div>
						<p style="font-size: 16px; margin: 0; color: var(--bl-text);">
							A ladybird can eat 5,000 aphids in its life. Farmers let them loose on purpose.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class=" w-full" in:fade={{ duration: 200, delay: 300 }}>
			<Suggestions
				className="grid grid-cols-2"
				suggestionPrompts={atSelectedModel?.info?.meta?.suggestion_prompts ??
					models[selectedModelIdx]?.info?.meta?.suggestion_prompts ??
					$config?.default_prompt_suggestions ??
					[]}
				{onSelect}
			/>
		</div>
	</div>
{/key}
