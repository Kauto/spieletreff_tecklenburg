<script lang="ts">
	import { base } from '$app/paths';
	import MapConsentDialog from '$lib/components/site/MapConsentDialog.svelte';
	import imgMeeple from '$lib/assets/images/meeple.png?enhanced';
	import imgHero from '$lib/assets/images/spieletreff-hero.jpg?enhanced';
	import imgGroupPhoto from '$lib/assets/images/group-photo.png?enhanced';
	import imgSpielabend from '$lib/assets/images/spieletreff-spieleabend.jpg?enhanced';
	import { calendarStore } from '$lib/events.svelte';
	import { locationOrUndefined } from '$lib/location';
	import Icon from '$lib/components/Icon.svelte';

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


	const upcoming = $derived(calendarStore.upcoming);
	const nextEvent = $derived(calendarStore.next);
	const nextThreeEvents = $derived(upcoming.slice(0, 3));
	const hasCalendarSourceData = $derived(calendarStore.events.length > 0);

	const TZ = 'Europe/Berlin';

	function formatDate(d: Date): string {
		return new Intl.DateTimeFormat('de-DE', {
			timeZone: TZ,
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(d);
	}

	function formatMonthTag(d: Date): string {
		return new Intl.DateTimeFormat('de-DE', { timeZone: TZ, month: 'long' }).format(d);
	}

	function formatTime(d: Date): string {
		return new Intl.DateTimeFormat('de-DE', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(d);
	}

	function formatHeroDate(d: Date): string {
		return new Intl.DateTimeFormat('de-DE', {
			timeZone: TZ,
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		}).format(d);
	}

</script>

<svelte:head>
	<title>Spieletreff Tecklenburg – Brettspielgruppe im Tecklenburger Land</title>
	<meta name="description" content="Brettspielgruppe im Tecklenburger Land – offen für alle. Jeden 1. und 3. Freitag in Mettingen und Brochterbeck. Kostenlos, einfach vorbeikommen." />
	<meta property="og:title" content="Spieletreff Tecklenburg – Brettspielgruppe im Tecklenburger Land" />
	<meta property="og:description" content="Jeden 1. und 3. Freitag gemeinsam Brettspiele spielen. Offen für alle – kein Mitgliedsbeitrag, einfach vorbeikommen." />
</svelte:head>

<main class="bg-surface font-body text-on-surface antialiased">
	<!-- Hero -->
	<section class="relative px-8 py-16 max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
		<div class="lg:col-span-7 z-10">
			<div class="flex flex-col gap-3 sm:flex-row">
				<div class="sm:order-2">
					<enhanced:img
						src={imgMeeple}
						alt=""
						aria-hidden="true"
						class="h-18 w-auto"
					/>
				</div>
				<div class="sm:order-1">
					<h1 class="text-2xl md:text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-1">
						Spieletreff Tecklenburger Land
					</h1>
					<p class="text-base text-on-surface-variant mb-16">Brettspielgruppe – offen für alle</p>
				</div>
			</div>
		<div class="inline-block clear-both bg-secondary-container text-on-secondary-container px-4 py-1 rounded-sm mb-4 font-bold text-sm tracking-widest uppercase">
			Das nächste Treffen
		</div>
			<h2 class="text-5xl md:text-7xl font-extrabold font-headline leading-tight text-primary italic mb-6">
				{nextEvent?.title ?? 'Spieleabend im ev. Gemeindehaus'}
			</h2>
			<div class="flex flex-wrap gap-x-6 gap-y-3 mb-8">
				<span class="flex items-center gap-2 text-on-surface-variant">
					<Icon name="calendar_month" class="text-xl leading-none text-secondary" />
					<span class="font-bold text-on-surface">{nextEvent ? formatHeroDate(nextEvent.start) : 'Freitag, 3. April'}</span>
				</span>
				<span class="flex items-center gap-2 text-on-surface-variant">
					<Icon name="schedule" class="text-xl leading-none text-secondary" />
					<span class="font-bold text-on-surface">
						{#if nextEvent}
							{#if nextEvent.allDay}Ganztägig{:else}Ab {formatTime(nextEvent.start)} Uhr{/if}
						{:else}
							Ab 14:30 Uhr
						{/if}
					</span>
				</span>
				<span class="flex items-center gap-2 text-on-surface-variant">
					<Icon name="location_on" class="text-xl leading-none text-secondary" />
					{#if locationOrUndefined(nextEvent?.location)}
						<button
							type="button"
							class="font-bold text-primary underline cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
							onclick={(event) => requestMapConsent(locationOrUndefined(nextEvent?.location)!, event.currentTarget)}
						>{locationOrUndefined(nextEvent?.location)}</button>
					{:else}
						<span class="font-bold text-on-surface">Brochterbeck</span>
					{/if}
				</span>
			</div>
			<p class="text-xl text-on-surface-variant max-w-xl mb-8 leading-relaxed">
				{nextEvent?.description ??
					'Wir packen die großen Strategie-Bretter und die schnellen Kartenspiele aus. Kommt vorbei, setzt euch dazu und lasst uns gemeinsam die Würfel rollen!'}
			</p>
			<a
				href="{base}/anmeldung"
				class="ui-button mb-10 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/8 px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
			>
				<Icon name="edit_note" class="text-base leading-none" />
				Vorab anmelden <span class="font-normal opacity-70">(optional)</span>
			</a>
		</div>
			<div class="lg:col-span-5 relative">
				<div class="relative rounded-2xl overflow-hidden shadow-xl">
					<enhanced:img
						src={imgHero}
						alt="Teilnehmer des Spieletreff Tecklenburg beim gemeinsamen Brettspielabend"
						sizes="(min-width: 1024px) 40vw, 100vw"
						class="w-full aspect-[4/5] object-cover"
						fetchpriority="high"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- About -->
	<section class="bg-surface-container-low py-24 px-8">
		<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
			<div class="order-2 md:order-1 grid grid-cols-2 gap-4">
			<enhanced:img
				src={imgGroupPhoto}
				alt="Mitglieder des Spieletreff Tecklenburg beim gemeinsamen Spielen"
				sizes="(min-width: 768px) 25vw, 45vw"
				class="rounded-xl w-full h-64 object-contain shadow-lg"
			/>
			<enhanced:img
				src={imgSpielabend}
				alt="Würfel auf einem Spielbrett"
				sizes="(min-width: 768px) 25vw, 45vw"
				class="rounded-xl w-full h-64 object-cover mt-12 shadow-lg"
			/>
			</div>
			<div class="order-1 md:order-2">
				<h2 class="text-4xl font-extrabold font-headline mb-8 text-on-surface leading-tight">
					Eine offene Runde –<br /><span class="text-primary">seit 2009.</span>
				</h2>
				<div class="space-y-6 text-lg text-on-surface-variant leading-relaxed">
					<p>
						Eine gemischte Gruppe von rund 50 Brettspiel-Begeisterten, die sich regelmäßig zu Spieleabenden trifft. Ob Gelegenheitsspieler oder Hardcore-Stratege – bei uns findet jeder einen Platz am Tisch.
					</p>
					<p>
						Wir spielen entweder in der DRK-Begegnungsstätte Mettingen oder im ev. Gemeindehaus Brochterbeck. Da das Spielen eine gemeinschaftliche Sache ist, gilt natürlich: Je größer die Gruppe, umso schöner der Abend. Wer Lust am Spielen hat, ist bei uns jederzeit herzlich willkommen.
					</p>
					<p>
						Kommt vorbei – ein freier Stuhl ist immer da.
					</p>
				<div class="pt-4 flex flex-wrap gap-3">
					<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-sm text-sm font-bold">Strategiespiele</span>
					<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-sm text-sm font-bold">Eurogames</span>
					<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-sm text-sm font-bold">Partyspiele</span>
					<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-sm text-sm font-bold">Für alle</span>
				</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section class="py-14 px-8 bg-surface-container">
		<div class="max-w-7xl mx-auto">
			<h2 class="text-sm font-bold text-secondary mb-8">Zum ersten Mal hier?</h2>
			<ol class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 list-none m-0 p-0">
				<li class="flex gap-5 items-start">
					<span aria-hidden="true" class="shrink-0 w-9 h-9 rounded-full bg-primary text-on-primary font-extrabold font-headline flex items-center justify-center text-base select-none">1</span>
					<div>
						<p class="font-bold font-headline text-on-surface text-lg leading-snug">Termin aussuchen</p>
						<p class="text-on-surface-variant mt-1.5 leading-relaxed">Im Kalender steht, wann und wo das nächste Treffen stattfindet.</p>
						<a href="{base}/kalender" class="inline-flex items-center gap-1 mt-3 text-sm font-bold text-primary hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
							Zum Kalender
							<Icon name="arrow_forward" class="text-sm leading-none" />
						</a>
					</div>
				</li>
			<li class="flex gap-5 items-start">
				<span aria-hidden="true" class="shrink-0 w-9 h-9 rounded-full bg-primary text-on-primary font-extrabold font-headline flex items-center justify-center text-base select-none">2</span>
				<div>
					<p class="font-bold font-headline text-on-surface text-lg leading-snug">Einfach vorbeikommen</p>
					<p class="text-on-surface-variant mt-1.5 leading-relaxed">Keine Anmeldung, kein Mitgliedsbeitrag – komm vorbei und setz dich dazu.</p>
					<p class="text-on-surface-variant mt-2 leading-relaxed">Du kannst dich aber auch gerne vorab anmelden – kein Muss, hilft uns aber bei der Planung.</p>
					<a href="{base}/anmeldung" class="inline-flex items-center gap-1 mt-3 text-sm font-bold text-primary hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
						Vorab anmelden
						<Icon name="arrow_forward" class="text-sm leading-none" />
					</a>
				</div>
			</li>
				<li class="flex gap-5 items-start">
					<span aria-hidden="true" class="shrink-0 w-9 h-9 rounded-full bg-primary text-on-primary font-extrabold font-headline flex items-center justify-center text-base select-none">3</span>
					<div>
						<p class="font-bold font-headline text-on-surface text-lg leading-snug">Im Kontakt bleiben</p>
						<p class="text-on-surface-variant mt-1.5 leading-relaxed">
							Wer möchte, tritt unserer <a
								href="https://chat.whatsapp.com/2naM3nPDYs08qymMxBIE8v?mode=gi_t"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="WhatsApp-Gruppe beitreten (öffnet extern)"
								class="font-bold text-primary underline decoration-primary/40 hover:decoration-primary rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
							>WhatsApp-Gruppe</a> bei und verpasst keine Termine oder spontanen Runden mehr.
						</p>
					</div>
				</li>
			</ol>
		</div>
	</section>

	<!-- Upcoming Events -->
	<section class="py-24 px-8 max-w-7xl mx-auto">
		<div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
		<div>
			<h2 class="text-4xl font-extrabold font-headline text-on-surface">Bevorstehende Treffen</h2>
		</div>
			<a class="text-on-surface-variant font-semibold flex items-center gap-2 hover:text-primary hover:underline group transition-colors" href="{base}/kalender">
				Gesamten Kalender ansehen
				<Icon name="arrow_forward" class="group-hover:translate-x-1 transition-transform" />
			</a>
		</div>
		{#if nextThreeEvents.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#each nextThreeEvents as event, i (event.uid)}
			<div class={`relative rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg ${i === 0 ? 'bg-primary-container text-on-primary-container shadow-lg' : 'bg-surface-container-highest'}`}>
				<a
					href="{base}/kalender#bevorstehende-termine"
					aria-label="{event.title} – Im Kalender ansehen"
					class="absolute inset-0 z-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
				><span class="sr-only">Im Kalender ansehen</span></a>
					<div class={`flex flex-col h-full ${i === 0 ? 'p-10' : 'p-8'}`}>
						<div class={`font-bold text-sm tracking-widest uppercase mb-4 ${i === 0 ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>Treffen im {formatMonthTag(event.start)}</div>
						<h3 class={`font-bold font-headline mb-4 leading-tight transition-colors ${i === 0 ? 'text-3xl group-hover:text-on-primary-container/80' : 'text-2xl group-hover:text-primary'}`}>
							{event.title}
						</h3>
						<div class="mt-auto space-y-4">
							<div class={`flex items-center gap-3 ${i === 0 ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>
								<Icon name="event" />
								<span class="font-bold">
									{formatDate(event.start)}
									{#if !event.allDay}&nbsp;ab {formatTime(event.start)} Uhr{/if}
								</span>
							</div>
							{#if event.location}
								<div class={`flex items-center gap-3 ${i === 0 ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>
									<Icon name="apartment" />
									{#if locationOrUndefined(event.location)}
										<button
											type="button"
											class="relative z-10 text-left hover:underline cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
											onclick={(eventClick) =>
												requestMapConsent(locationOrUndefined(event.location)!, eventClick.currentTarget)}
										>
											{locationOrUndefined(event.location)}
										</button>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>
				{/each}
			</div>
		{:else if hasCalendarSourceData}
			<div class="text-center py-20 text-on-surface-variant bg-surface-container-highest rounded-2xl">
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
		{:else}
			<div class="text-center py-20 text-on-surface-variant bg-surface-container-highest rounded-2xl">
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
		{/if}
	</section>

	<!-- CTA -->
	<section class="py-24 px-8 max-w-5xl mx-auto text-center">
		<div class="bg-primary p-12 md:p-20 rounded-3xl shadow-2xl relative overflow-hidden">
			<div class="absolute top-0 right-0 p-8 opacity-10">
				<Icon name="casino" fill class="text-9xl" />
			</div>
			<h2 class="text-3xl md:text-5xl font-extrabold font-headline text-on-primary mb-6 relative z-10">
				Immer dabei sein?
			</h2>
			<p class="text-on-primary/90 text-lg mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
				Tritt unserer WhatsApp-Gruppe bei und verpasse keine Treffen oder spontanen Spielrunden mehr.
			</p>
			<div class="flex justify-center relative z-10">
				<a
					href="https://chat.whatsapp.com/2naM3nPDYs08qymMxBIE8v?mode=gi_t"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp-Community beitreten (öffnet WhatsApp)"
					class="ui-button bg-surface-container-lowest text-primary px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2"
				>
					WhatsApp-Community beitreten
					<Icon name="open_in_new" class="text-base leading-none opacity-70" />
				</a>
			</div>
		</div>
	</section>
</main>

{#if showMapConsent}
	<MapConsentDialog open={showMapConsent} location={pendingLocation} onDecision={handleMapConsent} />
{/if}
