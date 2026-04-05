<script lang="ts">
	import { base } from '$app/paths';
	import { calendarStore } from '$lib/events.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let name = $state('');
	let email = $state('');
	let nachricht = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	const isLoading = $derived(status === 'loading');
	const canSubmit = $derived(!isLoading && name.trim().length > 0 && email.trim().length > 0);

	const nextEvent = $derived(calendarStore.next);

	const TZ = 'Europe/Berlin';
	function formatHeroDate(d: Date): string {
		return new Intl.DateTimeFormat('de-DE', {
			timeZone: TZ,
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		}).format(d);
	}
	function formatTime(d: Date): string {
		return new Intl.DateTimeFormat('de-DE', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(d);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		status = 'loading';
		errorMessage = '';

		try {
			const response = await fetch(`${base}/anmeldung.php`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: name.trim(), email: email.trim(), nachricht: nachricht.trim() })
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok || data.success === false) {
				throw new Error(
					data.message ?? 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
				);
			}

			status = 'success';
		} catch (err) {
			status = 'error';
			errorMessage =
				err instanceof Error
					? err.message
					: 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.';
		}
	}
</script>

<svelte:head>
	<title>Anmeldung – Spieletreff Tecklenburger Land</title>
	<meta
		name="description"
		content="Melde dich hier für den Spieletreff Tecklenburger Land an. Wir freuen uns, dich bei unserem nächsten Spieleabend begrüßen zu dürfen."
	/>
	<meta property="og:title" content="Anmeldung – Spieletreff Tecklenburger Land" />
	<meta
		property="og:description"
		content="Melde dich hier für den Spieletreff Tecklenburger Land an und freue dich auf einen unvergesslichen Spieleabend."
	/>
</svelte:head>

<main class="bg-surface font-body text-on-surface antialiased">
	<!-- Hero -->
	<section class="bg-surface-container-low px-6 py-14 md:py-16 border-b border-outline-variant/30">
		<div class="mx-auto max-w-3xl">
			<h1 class="font-headline text-3xl font-extrabold leading-tight md:text-4xl text-on-surface">
				Vorab anmelden
			</h1>
			<p class="mt-3 text-base leading-relaxed text-on-surface-variant md:text-lg max-w-xl">
				Kein Muss – aber wer sich kurz anmeldet, hilft uns besser zu planen. Du kannst dich für das nächste Treffen anmelden oder einfach Interesse bekunden.
			</p>
			{#if nextEvent}
				<div class="mt-6 inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg bg-surface-container px-4 py-3 text-sm">
					<span class="flex items-center gap-2 text-on-surface-variant">
						<Icon name="event" class="text-base leading-none text-secondary" />
						<span class="font-bold text-on-surface">{formatHeroDate(nextEvent.start)}</span>
					</span>
					{#if !nextEvent.allDay}
						<span class="flex items-center gap-2 text-on-surface-variant">
							<Icon name="schedule" class="text-base leading-none text-secondary" />
							<span class="font-semibold">Ab {formatTime(nextEvent.start)} Uhr</span>
						</span>
					{/if}
					{#if nextEvent.location}
						<span class="flex items-center gap-2 text-on-surface-variant">
							<Icon name="location_on" class="text-base leading-none text-secondary" />
							<span class="font-semibold">{nextEvent.location}</span>
						</span>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<!-- Form section -->
	<section class="px-6 py-16 md:py-20">
		<div class="mx-auto max-w-lg">
			<div
				class="rounded-[var(--radius-xl)] border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm md:p-10"
			>
				{#if status === 'success'}
					<!-- Success state -->
					<div class="flex flex-col items-center gap-5 py-4 text-center">
						<Icon name="check_circle" class="text-5xl text-primary" />
						<div>
							<h2 class="font-headline text-2xl font-extrabold text-on-surface">Anmeldung erhalten!</h2>
						<p class="mt-3 leading-relaxed text-on-surface-variant">
							Vielen Dank, <strong class="text-on-surface">{name}</strong>! Deine Anmeldung ist bei uns angekommen.
							{#if nextEvent}
								Wir freuen uns auf dich am <strong class="text-on-surface">{formatHeroDate(nextEvent.start)}</strong>.
							{:else}
								Wir freuen uns auf dich beim nächsten Spieletreff.
							{/if}
						</p>
						</div>
						<div class="mt-2 flex flex-wrap justify-center gap-3">
							<a
								href="{base}/"
								class="ui-button inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-outline-variant px-5 py-2.5 font-headline text-sm font-bold text-on-surface transition-colors hover:bg-surface-container"
							>
								<Icon name="home" class="text-base leading-none" />
								Zur Startseite
							</a>
							<a
								href="{base}/kalender"
								class="ui-button inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-primary px-5 py-2.5 font-headline text-sm font-bold text-on-primary transition-colors hover:bg-primary/90"
							>
								<Icon name="calendar_month" class="text-base leading-none" />
								Kalender ansehen
							</a>
						</div>
					</div>
				{:else}
				<h2 class="font-headline text-xl font-extrabold text-on-surface">Deine Anmeldung</h2>
				<p class="mt-1 text-sm text-on-surface-variant">Alle mit <span aria-hidden="true">*</span> markierten Felder sind Pflichtfelder. Du meldest dich für das nächste Treffen an – oder gibst einfach Bescheid, dass du grundsätzlich dabei sein möchtest.</p>

				<form onsubmit={handleSubmit} class="mt-6 flex flex-col gap-5" novalidate>
					<!-- Name -->
					<div class="flex flex-col gap-1.5">
						<label for="name" class="font-label text-sm font-semibold text-on-surface-variant">Name <span aria-hidden="true">*</span></label>
						<input
							id="name"
							type="text"
							bind:value={name}
							required
							disabled={isLoading}
							placeholder="Dein Name"
							autocomplete="name"
							class="rounded-[var(--radius-lg)] border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-colors hover:border-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>

					<!-- E-Mail -->
					<div class="flex flex-col gap-1.5">
						<label for="email" class="font-label text-sm font-semibold text-on-surface-variant">E-Mail-Adresse <span aria-hidden="true">*</span></label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							disabled={isLoading}
							placeholder="deine@email.de"
							autocomplete="email"
							class="rounded-[var(--radius-lg)] border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-colors hover:border-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>

					<!-- Nachricht -->
					<div class="flex flex-col gap-1.5">
						<label for="nachricht" class="font-label text-sm font-semibold text-on-surface-variant"
							>Nachricht <span class="font-normal opacity-70">(optional)</span></label
						>
						<textarea
							id="nachricht"
							bind:value={nachricht}
							disabled={isLoading}
							placeholder="Hast du noch Fragen oder Anmerkungen?"
							rows="4"
							class="resize-y rounded-[var(--radius-lg)] border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-colors hover:border-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
						></textarea>
					</div>

					<!-- Error banner -->
					{#if status === 'error'}
						<div
							class="flex items-start gap-3 rounded-[var(--radius-lg)] border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container"
							role="alert"
						>
							<Icon name="warning" class="text-lg leading-none text-error" />
							<p>{errorMessage}</p>
						</div>
					{/if}

					<!-- Submit -->
					<button
						type="submit"
						disabled={!canSubmit}
						class="ui-button mt-1 w-full rounded-[var(--radius-lg)] bg-primary px-6 py-3.5 font-headline font-bold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:transform-none"
					>
						{#if isLoading}
							<span class="flex items-center justify-center gap-2">
								<span
									class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
									aria-hidden="true"
								></span>
								Wird gesendet …
							</span>
						{:else}
							Jetzt anmelden
						{/if}
					</button>

					<!-- DSGVO note -->
					<p class="text-center text-xs leading-relaxed text-on-surface-variant/60">
						Deine Daten werden ausschließlich zur Bearbeitung deiner Anmeldung verwendet und nicht weitergegeben.
						<a href="{base}/datenschutz" class="underline decoration-on-surface-variant/30 transition-colors hover:text-on-surface-variant">Datenschutzerklärung</a>
					</p>
				</form>
				{/if}
			</div>
		</div>
	</section>
</main>
