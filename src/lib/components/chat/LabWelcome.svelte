<script lang="ts">
	import { config, user } from '$lib/stores';
	import { getActiveLabProfile } from '$lib/utils/labTheme';

	export let modelName = '';

	$: profile = getActiveLabProfile($config, $user);
	$: interpolate = (value = '') =>
		value
			.replaceAll('{{user}}', $user?.name ?? '')
			.replaceAll('{{model}}', modelName || profile?.mascot_name || '');
</script>

{#if profile}
	<div class="flex w-full max-w-2xl items-start gap-3 text-left">
		{#if profile.mascot_url}
			<img
				src={profile.mascot_url}
				alt={profile.mascot_name || ''}
				class="size-11 shrink-0 rounded-2xl object-contain"
			/>
		{/if}
		<div class="lab-card min-w-0 flex-1 px-5 py-4">
			<h2 class="lab-heading m-0 text-2xl leading-tight">
				{interpolate(profile.greeting || 'Hello, {{user}}')}
			</h2>
			{#if profile.subtitle}
				<p class="mt-1 text-base" style="color: var(--lab-muted, inherit);">
					{interpolate(profile.subtitle)}
				</p>
			{/if}
			{#if profile.daily_message}
				<div class="lab-highlight mt-3 rounded-xl px-4 py-3">
					{#if profile.daily_label}
						<div class="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider">
							{profile.daily_label}
						</div>
					{/if}
					<p class="m-0 text-sm">{interpolate(profile.daily_message)}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
