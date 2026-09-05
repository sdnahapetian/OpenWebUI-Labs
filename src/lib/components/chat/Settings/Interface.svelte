<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import InterfaceSettings from '$lib/components/common/InterfaceSettings.svelte';
	import { config, user } from '$lib/stores';
	import { updateUserSettings } from '$lib/apis/users';

	const dispatch = createEventDispatcher();
	const i18n: any = getContext('i18n');

	export let saveSettings: Function;
	export let personalSettingsValue: Record<string, any> = {};

	let interfaceSettings: any;
	let labFlavor = $user?.settings?.lab_flavor ?? '';
	$: labProfiles = Object.entries($config?.lab_theme?.profiles ?? {}) as [string, any][];
</script>

<form
	id="tab-interface"
	class="flex flex-col h-full justify-between text-sm"
	on:submit|preventDefault={async () => {
		await interfaceSettings?.save();
		if ($config?.lab_theme?.allow_user_selection) {
			const updated = await updateUserSettings(localStorage.token, { lab_flavor: labFlavor });
			user.update((current) => (current ? { ...current, settings: updated } : current));
		}
		dispatch('save');
	}}
>
	<h2 class="text-sm font-medium text-gray-900 dark:text-white mb-4">{$i18n.t('Interface')}</h2>

	<div class="flex-1 min-h-0 overflow-y-auto scrollbar-hover pr-1.5">
		{#if $config?.lab_theme?.enabled && $config?.lab_theme?.allow_user_selection}
			<div class="mb-4">
				<label class="mb-1 block text-xs text-gray-500" for="lab-flavor"
					>{$i18n.t('Lab Flavor')}</label
				>
				<select
					id="lab-flavor"
					class="w-full rounded-lg bg-gray-50 p-2 text-sm dark:bg-gray-850"
					bind:value={labFlavor}
				>
					<option value="">{$i18n.t('Instance Default')}</option>
					{#each labProfiles as [id, profile]}
						<option value={id}>{profile.name || id}</option>
					{/each}
				</select>
			</div>
		{/if}
		<InterfaceSettings bind:this={interfaceSettings} {saveSettings} {personalSettingsValue} />
	</div>

	<div class="shrink-0 flex justify-end text-sm font-normal">
		<button
			class="px-3.5 py-1.5 text-sm font-normal bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full"
			type="submit"
		>
			{$i18n.t('Save')}
		</button>
	</div>
</form>
