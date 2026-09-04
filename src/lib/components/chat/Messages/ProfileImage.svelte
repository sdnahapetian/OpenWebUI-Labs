<script lang="ts">
	import { WEBUI_BASE_URL } from '$lib/constants';
	import { safeImageUrl } from '$lib/utils/safeImageUrl';

	export let className = 'size-8';
	// LICENSE covers this Open WebUI fallback logo.
	// Do not alter, remove, obscure, or replace it except as LICENSE permits:
	// https://docs.openwebui.com/license.
	const FALLBACK_SRC = `${WEBUI_BASE_URL}/static/favicon.png`;

	export let src = FALLBACK_SRC;

	let failed = false;
	$: if (src) failed = false;

	$: showLadybug = !src || src === FALLBACK_SRC || failed;
</script>

{#if showLadybug}
	<!-- Bug Lab mascot: Dot the ladybug -->
	<svg
		aria-hidden="true"
		class="{className} rounded-2xl"
		viewBox="0 0 40 40"
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
{:else}
	<img
		aria-hidden="true"
		src={safeImageUrl(src)}
		class="{className} object-cover rounded-2xl"
		alt="profile"
		draggable="false"
		on:error={() => {
			failed = true;
		}}
	/>
{/if}
