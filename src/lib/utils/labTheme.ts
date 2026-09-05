export type LabProfile = Record<string, any>;

export const getActiveLabFlavor = (
	config: any,
	user?: any,
	queryFlavor?: string | null
): string => {
	const labTheme = config?.lab_theme;
	if (!labTheme?.enabled) return '';
	const requested = user?.id
		? user.settings?.lab_flavor || labTheme.default_flavor || ''
		: queryFlavor || labTheme.default_flavor || '';
	return requested && labTheme.profiles?.[requested] ? requested : '';
};

export const getActiveLabProfile = (
	config: any,
	user?: any,
	queryFlavor?: string | null
): LabProfile | null => {
	const flavor = getActiveLabFlavor(config, user, queryFlavor);
	return flavor ? config.lab_theme.profiles[flavor] : null;
};

export const applyLabTheme = (config: any, user?: any, queryFlavor?: string | null) => {
	if (typeof document === 'undefined') return;

	const root = document.documentElement;
	const flavor = getActiveLabFlavor(config, user, queryFlavor);
	const profile = getActiveLabProfile(config, user, queryFlavor);
	const variableNames = [
		'background',
		'surface',
		'card',
		'text',
		'muted',
		'divider',
		'accent',
		'accent-hover',
		'accent-active',
		'highlight',
		'highlight-border',
		'highlight-text',
		'font-heading',
		'font-body',
		'login-background-image'
	];

	variableNames.forEach((name) => root.style.removeProperty(`--lab-${name}`));
	root.toggleAttribute('data-lab-enabled', Boolean(profile));
	if (flavor) root.dataset.labFlavor = flavor;
	else delete root.dataset.labFlavor;

	const oldFont = document.getElementById('lab-font-stylesheet');
	oldFont?.remove();
	if (!profile) return;

	for (const [key, value] of Object.entries(profile.colors ?? {})) {
		if (value) root.style.setProperty(`--lab-${key.replaceAll('_', '-')}`, String(value));
	}
	if (profile.font_heading) root.style.setProperty('--lab-font-heading', profile.font_heading);
	if (profile.font_body) root.style.setProperty('--lab-font-body', profile.font_body);
	if (profile.login_background_image_url) {
		root.style.setProperty(
			'--lab-login-background-image',
			`url("${profile.login_background_image_url}")`
		);
	}
	if (profile.font_stylesheet_url) {
		const link = document.createElement('link');
		link.id = 'lab-font-stylesheet';
		link.rel = 'stylesheet';
		link.href = profile.font_stylesheet_url;
		document.head.appendChild(link);
	}
};
