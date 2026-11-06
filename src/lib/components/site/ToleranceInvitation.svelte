<script lang="ts">
	import { onMount } from 'svelte';
	import {
		detectInvitationLanguage,
		invitationLanguages,
		type InvitationLanguageCode
	} from '#lib/tolerance-invitation.js';

	let selected = $state<InvitationLanguageCode>('de');

	const active = $derived(
		invitationLanguages.find((language) => language.code === selected) ?? invitationLanguages[0]
	);

	onMount(() => {
		const tags =
			navigator.languages && navigator.languages.length > 0
				? navigator.languages
				: [navigator.language];
		selected = detectInvitationLanguage(tags);
	});

	function onTabKeydown(event: KeyboardEvent, index: number): void {
		const last = invitationLanguages.length - 1;
		let next = index;

		if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
		else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = last;
		else return;

		event.preventDefault();
		selected = invitationLanguages[next].code;
		document.getElementById(`tolerance-invitation-tab-${selected}`)?.focus();
	}
</script>

<div class="mt-8 border-t border-outline-variant/70 pt-6">
	<p
		id="tolerance-invitation-label"
		class="font-headline text-xs font-bold uppercase tracking-widest text-secondary-dim"
	>
		Einladung
	</p>
	<div
		class="mt-4 flex flex-wrap gap-2"
		role="tablist"
		aria-labelledby="tolerance-invitation-label"
	>
		{#each invitationLanguages as language, index (language.code)}
			<button
				type="button"
				id="tolerance-invitation-tab-{language.code}"
				class="min-h-11 rounded-full px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 {selected ===
				language.code
					? 'bg-primary text-on-primary'
					: 'bg-surface-container text-on-surface hover:bg-surface-container-high'}"
				role="tab"
				lang={language.code}
				aria-selected={selected === language.code}
				aria-controls="tolerance-invitation-panel"
				tabindex={selected === language.code ? 0 : -1}
				onclick={() => (selected = language.code)}
				onkeydown={(event) => onTabKeydown(event, index)}
			>
				{language.label}
			</button>
		{/each}
	</div>
	<div
		id="tolerance-invitation-panel"
		class="mt-4 max-w-3xl space-y-3 rounded-xl text-lg leading-relaxed text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
		role="tabpanel"
		aria-labelledby="tolerance-invitation-tab-{active.code}"
		lang={active.code}
		dir={active.dir}
		tabindex="0"
	>
		{#each active.paragraphs as paragraph (paragraph)}
			<p>{paragraph}</p>
		{/each}
	</div>
</div>
