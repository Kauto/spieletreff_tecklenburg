<script lang="ts">
	import MapConsentDialog from '$lib/components/site/MapConsentDialog.svelte';
	import { calendarStore } from '$lib/events.svelte';
	import { locationOrUndefined } from '$lib/location';
	import type { CalendarEvent } from '$lib/types';
	import Icon from '$lib/components/Icon.svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteMap } from 'svelte/reactivity';
	import { quartOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const now = new Date();
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const upcoming = $derived(calendarStore.upcoming);
	const past = $derived(calendarStore.events.filter((e) => e.end < todayStart).slice().reverse());
	const nextEvent = $derived(calendarStore.next);
	const hasCalendarSourceData = $derived(calendarStore.events.length > 0);

	type MonthGroup = { key: string; label: string; events: CalendarEvent[] };

	function groupByMonth(events: CalendarEvent[]): MonthGroup[] {
		const groups = new SvelteMap<string, MonthGroup>(); // local computation only, not reactive
		for (const event of events) {
			const key = groupKeyFormatter.format(event.start); // e.g. "2026-04" in Europe/Berlin
			if (!groups.has(key)) {
				const label = monthYearFormatter.format(event.start);
				groups.set(key, { key, label, events: [] });
			}
			groups.get(key)!.events.push(event);
		}
		return Array.from(groups.values());
	}

	const upcomingGroups = $derived(groupByMonth(upcoming));
	const pastGroups = $derived(groupByMonth(past));

	const TZ = 'Europe/Berlin';

	const weekdayFormatter = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, weekday: 'short' });
	const timeFormatter = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
	const fullDateFormatter = new Intl.DateTimeFormat('de-DE', {
		timeZone: TZ,
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	const dayFormatter = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, day: 'numeric' });
	const monthYearFormatter = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, month: 'long', year: 'numeric' });
	const groupKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' });

	function formatWeekday(d: Date): string {
		return weekdayFormatter.format(d);
	}
	function formatDay(d: Date): string {
		return dayFormatter.format(d);
	}
	function formatTime(d: Date): string {
		return timeFormatter.format(d);
	}
	function formatFullDate(d: Date): string {
		return fullDateFormatter.format(d);
	}

	let showMapConsent = $state(false);
	let pendingLocation = $state('');
	let lastMapTrigger: HTMLElement | null = null;

	function requestMapConsent(location: string, trigger?: EventTarget | null): void {
		const cleaned = locationOrUndefined(location);
		if (!cleaned) return;
		pendingLocation = cleaned;
		lastMapTrigger = trigger instanceof HTMLElement ? trigger : null;
		showMapConsent = true;
	}

	function handleMapConsent(accepted: boolean): void {
		if (accepted && pendingLocation) {
			const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pendingLocation)}`;
			window.open(mapsUrl, '_blank', 'noopener,noreferrer');
		}
		showMapConsent = false;
		pendingLocation = '';
		lastMapTrigger?.focus();
		lastMapTrigger = null;
	}

	const accents = [
		{ text: 'text-primary', dot: 'bg-primary' },
		{ text: 'text-secondary', dot: 'bg-secondary' },
		{ text: 'text-tertiary', dot: 'bg-tertiary' }
	];

	const reduceMotion = $derived(prefersReducedMotion.current);
	const heroFlyY = $derived(reduceMotion ? 0 : 12);
	const cardFlyY = $derived(reduceMotion ? 0 : 10);
	const heroDuration = $derived(reduceMotion ? 0 : 420);
	const cardDuration = $derived(reduceMotion ? 0 : 320);

	let showAllPast = $state(false);
	const visiblePastGroups = $derived(showAllPast ? pastGroups : pastGroups.slice(0, 2));
</script>

<svelte:head>
	<title>Kalender – Spieletreff Tecklenburg</title>
	<meta name="description" content="Alle Spieleabende und Termine des Spieletreffs Tecklenburg auf einen Blick. Wir treffen uns jeden 1. und 3. Freitag im Monat." />
	<meta property="og:title" content="Kalender – Spieletreff Tecklenburg" />
	<meta property="og:description" content="Alle Spieleabende und Termine auf einen Blick. Jeden 1. und 3. Freitag im Tecklenburger Land." />
</svelte:head>

<main class="bg-surface font-body text-on-surface antialiased">
	<!-- Hero -->
	<section class="bg-surface-container-low py-16 px-8">
		<div class="max-w-7xl mx-auto">
			<div
				in:fly={{ y: heroFlyY, duration: heroDuration, delay: reduceMotion ? 0 : 30, easing: quartOut }}
				class="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-sm mb-4 font-bold text-sm tracking-widest uppercase"
			>
				Spielplan
			</div>
			<h1
				in:fly={{ y: heroFlyY, duration: heroDuration, delay: reduceMotion ? 0 : 100, easing: quartOut }}
				class="text-5xl md:text-6xl font-extrabold font-headline text-on-surface leading-tight mb-4"
			>
				Unser <span class="text-primary italic">Kalender</span>
			</h1>
			<p
				in:fly={{ y: heroFlyY, duration: heroDuration, delay: reduceMotion ? 0 : 170, easing: quartOut }}
				class="text-xl text-on-surface-variant max-w-2xl leading-relaxed"
			>
				Alle Spieleabende, Sondertermine und Turniere – immer auf einen Blick. Wir treffen uns jeden 1. und 3. Freitag im Monat.
			</p>
		{#if nextEvent}
			<div
				in:fly={{ y: heroFlyY, duration: heroDuration, delay: reduceMotion ? 0 : 240, easing: quartOut }}
				class="mt-8 inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold"
			>
				<Icon name="event_upcoming" />
				Nächster Spielabend: {formatFullDate(nextEvent.start)}{#if !nextEvent.allDay}&nbsp;ab {formatTime(nextEvent.start)} Uhr{/if}
			</div>
		{/if}
		</div>
	</section>

	<!-- Upcoming Events -->
	<section id="bevorstehende-termine" class="py-20 px-8 bg-surface">
		<div class="max-w-7xl mx-auto">
		<h2 class="text-3xl font-extrabold font-headline text-on-surface mb-8">
			Bevorstehende Termine
		</h2>

		{#if upcomingGroups.length === 0 && hasCalendarSourceData}
			<div class="text-center py-20 text-on-surface-variant">
				<Icon name="event_busy" class="text-7xl mb-4 block opacity-30" />
				<p class="text-2xl font-bold font-headline">Keine bevorstehenden Termine</p>
				<p class="mt-2 text-lg">Kein Treffen in Sicht? Tritt der WhatsApp-Gruppe bei und verpasse keine spontanen Runden.</p>
				<a
					href="https://chat.whatsapp.com/2naM3nPDYs08qymMxBIE8v?mode=gi_t"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp-Gruppe beitreten (öffnet extern)"
					class="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
				>
					<Icon name="forum" class="text-base leading-none" />
					WhatsApp-Gruppe beitreten
				</a>
			</div>
		{:else if upcomingGroups.length === 0}
			<div class="text-center py-20 text-on-surface-variant">
				<Icon name="cloud_off" class="text-7xl mb-4 block opacity-30" />
				<p class="text-2xl font-bold font-headline">Termine sind gerade nicht verfügbar</p>
				<p class="mt-2 text-lg">Bitte versuche es in ein paar Minuten erneut.</p>
				<button
					type="button"
					onclick={() => window.location.reload()}
					class="mt-6 inline-flex items-center gap-2 bg-surface-container text-on-surface px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
				>
					<Icon name="refresh" class="text-base leading-none" />
					Seite neu laden
				</button>
			</div>
		{:else}
		<div class="space-y-10">
			{#each upcomingGroups as group, gi (group.key)}
					{@const accent = accents[gi % 3]}
					<div class="bg-surface-container rounded-3xl p-6 md:p-8">
						<!-- Month heading -->
						<div class="flex items-center gap-4 mb-8">
							<div class="w-3 h-3 rounded-full {accent.dot}"></div>
							<h3 class="text-sm font-bold font-headline {accent.text} uppercase tracking-[0.2em]">{group.label}</h3>
						</div>
						<!-- Event list -->
						<div class="space-y-8">
							{#each group.events as event, ei (event.uid)}
								{@const isFirst = gi === 0 && ei === 0}
								<div
									in:fly={{
										y: cardFlyY,
										duration: cardDuration,
										delay: reduceMotion ? 0 : Math.min(40 + gi * 45 + ei * 30, 260),
										easing: quartOut
									}}
									class="upcoming-card bg-surface-container-highest rounded-2xl overflow-hidden flex flex-col sm:flex-row"
								>
									<!-- Date badge -->
									<div class="flex flex-col items-center justify-center p-5 min-w-[80px] bg-surface-container-low shrink-0">
										<span class="text-xs font-bold uppercase tracking-widest {accent.text}">
											{formatWeekday(event.start)}
										</span>
										<span class="text-4xl font-extrabold font-headline text-on-surface leading-none">
											{formatDay(event.start)}
										</span>
									</div>
									<!-- Details -->
									<div class="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between min-w-0">
										<div class="min-w-0">
											{#if isFirst}
												<span class="inline-block bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide mb-1">
													Nächstes Treffen
												</span>
											{/if}
											<h4 class="text-xl font-bold font-headline text-on-surface line-clamp-1">
												{event.title}
											</h4>
											<div class="flex flex-wrap gap-x-4 gap-y-1 mt-2">
												{#if !event.allDay}
													<span class="flex items-center gap-1.5 text-on-surface-variant text-sm">
														<Icon name="schedule" class="text-lg leading-none" />
														{formatTime(event.start)} Uhr
													</span>
												{:else}
													<span class="flex items-center gap-1.5 text-on-surface-variant text-sm">
														<Icon name="today" class="text-lg leading-none" />
														Ganztägig
													</span>
												{/if}
												{#if event.location}
													<span class="flex items-center gap-1.5 text-on-surface-variant text-sm">
														<Icon name="location_on" class="text-lg leading-none" />
														{#if locationOrUndefined(event.location)}
															<button
																type="button"
																class="text-left hover:underline cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
																onclick={(eventClick) =>
																	requestMapConsent(locationOrUndefined(event.location)!, eventClick.currentTarget)}
															>
																{locationOrUndefined(event.location)}
															</button>
														{/if}
													</span>
												{/if}
											</div>
											{#if event.description}
												<p class="mt-3 text-on-surface-variant text-sm leading-relaxed whitespace-pre-line rounded-lg bg-surface-container-low px-3 py-2">
													{event.description}
												</p>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
		</div>
	</section>

	<!-- Past Events -->
	{#if pastGroups.length > 0}
		<section class="py-16 px-8 bg-surface-container-low">
			<div class="max-w-7xl mx-auto">
			<h2 class="text-2xl font-extrabold font-headline text-on-surface-variant mb-8">
				Vergangene Treffen
			</h2>
		<div class="space-y-10 opacity-60">
			{#each visiblePastGroups as group (group.key)}
					<div class="bg-surface-container rounded-3xl p-6 md:p-8">
						<div class="flex items-center gap-4 mb-4">
							<div class="w-2 h-2 rounded-full bg-outline-variant"></div>
							<h3 class="text-xs font-bold font-headline text-secondary uppercase tracking-[0.2em]">{group.label}</h3>
						</div>
						<div class="space-y-6">
							{#each group.events as event (event.uid)}
								<div class="bg-surface-container-highest rounded-xl flex flex-col sm:flex-row overflow-hidden">
									<div class="flex flex-col items-center justify-center p-4 min-w-[72px] bg-surface-container-low shrink-0">
										<span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
											{formatWeekday(event.start)}
										</span>
										<span class="text-3xl font-extrabold font-headline text-on-surface-variant/60 leading-none">
											{formatDay(event.start)}
										</span>
									</div>
									<div class="flex-1 p-4 min-w-0">
										<h4 class="font-bold font-headline text-on-surface-variant line-clamp-1">
											{event.title}
										</h4>
										<div class="flex flex-wrap gap-3 mt-1">
											{#if event.location}
												<span class="flex items-center gap-1 text-on-surface-variant/70 text-sm">
													<Icon name="location_on" class="text-base leading-none" />
													{#if locationOrUndefined(event.location)}
								<button
																type="button"
																class="text-left hover:underline cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
																onclick={(eventClick) =>
																	requestMapConsent(locationOrUndefined(event.location)!, eventClick.currentTarget)}
															>
															{locationOrUndefined(event.location)}
														</button>
													{/if}
												</span>
											{/if}
											{#if !event.allDay}
												<span class="flex items-center gap-1 text-on-surface-variant/70 text-sm">
												<Icon name="schedule" class="text-base leading-none" />
												{formatTime(event.start)} Uhr
												</span>
											{/if}
										</div>
										{#if event.description}
										<p class="mt-3 text-on-surface-variant/80 text-sm leading-relaxed whitespace-pre-line rounded-lg bg-surface-container-low/70 px-3 py-2">
											{event.description}
										</p>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
		</div>
		{#if pastGroups.length > 2}
			<button
				type="button"
				onclick={() => (showAllPast = !showAllPast)}
				class="mt-8 flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
			>
				<Icon name="expand_more" class="text-base leading-none transition-transform duration-200 {showAllPast ? 'rotate-180' : ''}" />
				{showAllPast ? 'Weniger anzeigen' : `${pastGroups.length - 2} weitere Monate anzeigen`}
			</button>
		{/if}
		</div>
	</section>
{/if}

	<!-- CTA -->
	<section class="py-12 px-8 bg-surface">
		<div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
			<div>
				<p class="font-bold font-headline text-on-surface text-xl">Keinen Termin verpassen?</p>
				<p class="text-on-surface-variant mt-1 leading-relaxed">Alle Infos und spontane Treffen direkt via WhatsApp, Facebook und Instagram.</p>
			</div>
			<div class="flex flex-wrap items-center gap-3 shrink-0">
				<a
					href="https://chat.whatsapp.com/2naM3nPDYs08qymMxBIE8v?mode=gi_t"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp-Community beitreten (öffnet WhatsApp)"
					class="ui-button inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold"
				>
					<Icon name="forum" class="text-xl leading-none" />
					WhatsApp beitreten
					<Icon name="open_in_new" class="text-sm leading-none opacity-70" />
				</a>
				<a
					href="https://www.facebook.com/p/Spieletreff-Tecklenburger-Land-100064257206980/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Spieletreff Tecklenburger Land auf Facebook (öffnet extern)"
					class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-primary hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
				>
					Facebook
					<Icon name="open_in_new" class="text-sm leading-none opacity-70" />
				</a>
				<a
					href="https://www.instagram.com/spielteckland?igsh=dTZvbGVnbjJ6MTZ0"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Spieletreff Tecklenburger Land auf Instagram (öffnet extern)"
					class="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-primary hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
				>
					Instagram
					<Icon name="open_in_new" class="text-sm leading-none opacity-70" />
				</a>
			</div>
		</div>
	</section>
</main>

{#if showMapConsent}
	<MapConsentDialog open={showMapConsent} location={pendingLocation} onDecision={handleMapConsent} />
{/if}

<style>
	.upcoming-card {
		transition:
			transform 240ms ease,
			opacity 240ms ease,
			filter 240ms ease;
		transform: translateY(0) scale(1);
		will-change: transform;
	}

	.upcoming-card:hover {
		transform: translateY(-3px) scale(1.008);
		filter: saturate(1.03);
	}

	@media (prefers-reduced-motion: reduce) {
		.upcoming-card {
			transition-duration: 1ms !important;
			transform: none !important;
			filter: none !important;
		}
	}
</style>

