<script lang="ts">
	import { base } from '$app/paths';

	const photos = [
		{ src: `${base}/images/gallery/spieleabend-16.jpg`, alt: 'Spieleabend – Blick auf die Spieletische' },
		{ src: `${base}/images/gallery/spieleabend-12.jpg`, alt: 'Konzentrierte Runde am Spieltisch' },
		{ src: `${base}/images/gallery/spieleabend-4.jpg`, alt: 'Spieler wählen ihr nächstes Spiel' },
		{ src: `${base}/images/gallery/spieleabend-6.jpg`, alt: 'Gesellige Runde beim Brettspielen' },
		{ src: `${base}/images/gallery/spieleabend-3.jpg`, alt: 'Karten liegen auf dem Tisch' },
		{ src: `${base}/images/gallery/spieleabend-22.jpg`, alt: 'Spieler diskutieren ihren Zug' },
		{ src: `${base}/images/gallery/spieleabend-78.jpg`, alt: 'Abend in lockerer Runde' },
		{ src: `${base}/images/gallery/spieleabend-17.jpg`, alt: 'Brettspiele auf dem Tisch' },
		{ src: `${base}/images/gallery/spieleabend-76.jpg`, alt: 'Gemeinschaft beim Spielen' },
	];
</script>

<svelte:head>
	<title>Geschichte – Spieletreff Tecklenburger Land</title>
</svelte:head>

<main class="min-h-screen bg-surface font-body text-on-surface antialiased">

	<!-- Page Hero -->
	<section class="bg-surface-container-low px-8 py-16 md:py-20">
		<div class="max-w-4xl mx-auto">
			<div class="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-sm mb-5 font-bold text-sm tracking-widest uppercase">
				Über uns
			</div>
			<h1 class="text-4xl md:text-5xl font-extrabold font-headline text-on-surface mb-5 leading-tight">
				Unsere Geschichte
			</h1>
			<p class="text-xl text-on-surface-variant leading-relaxed max-w-2xl">
				Seit 2009 treffen wir uns regelmäßig im Tecklenburger Land zum gemeinsamen Brettspielen. Was damals mit fünf Personen begann, ist heute eine offene Runde von rund 50 Spielbegeisterten.
			</p>
		</div>
	</section>

	<!-- Article -->
	<section class="px-8 py-16 md:py-20">
		<div class="max-w-4xl mx-auto space-y-8 text-lg text-on-surface-variant leading-relaxed">

			<p>
				Alles begann im November 2009 mit einem Spielenachmittag im evangelischen Gemeindehaus Brochterbeck – für Familien und brettspielbegeisterte Erwachsene. Über ein Brettspielforum hatte Martin Grüter das Treffen angekündigt, und so trudelten auch einige Besucher aus dem Rest des Kreises Steinfurt ein. Am Ende des Tages stand für die letzten fünf Anwesenden fest:
			</p>

			<blockquote class="border-l-4 border-primary pl-6 py-1 my-2">
				<p class="font-semibold font-headline text-on-surface text-xl md:text-2xl leading-snug italic">
					„Wir wollen uns regelmäßig zum Brettspieleabend treffen!"
				</p>
				<p class="text-sm text-on-surface-variant mt-3 not-italic">
					— Gründungsrunde im November 2009: Martin &amp; Alexandra Grüter, Mario Lampe sowie Nils &amp; Nathalie Bäumer
				</p>
			</blockquote>

			<p>
				Und so wurde der Spieletreff Tecklenburger Land geboren. Über die Zeit fanden viele weitere Spieler den Weg zum Treffen – durch Mundpropaganda, die Facebook-Gruppe und heute vor allem über WhatsApp.
			</p>

			<p>
				Gespielt wird, was gefällt. Wer mag, bringt seine Brett- oder Kartenspiel-Highlights von zuhause mit, und die Gruppe wählt gemeinsam aus. Auf diese Weise hat man die Möglichkeit, eine große Anzahl neuer und auch älterer Spiele kennenzulernen. Viele Mitglieder sind regelmäßig auf der Spielemesse in Essen anzutreffen und bringen frische Exemplare direkt zurück.
			</p>

			<p>
				Inzwischen umfasst der Spieletreff eine Gruppe von etwa 50 Personen, die je nach eigenem Zeitplan, Lust und Laune am Treffen teilnehmen. Mindestens zehn Personen finden sich immer zusammen. Regelmäßiges Erscheinen ist keine Pflicht – schließlich handelt es sich um einen Spieleabend in lockerer Runde.
			</p>

			<p>
				Daher verzichtet die Gruppe auf unnötige Formalien und hat lediglich eine Vereinbarung getroffen: Wer kommen möchte, meldet sich kurz über die WhatsApp-Gruppe – so kann auf Nachzügler Rücksicht genommen werden. Denn sobald die Spielerunden aufgeteilt sind und die Spiele begonnen haben, lässt sich ein laufendes Spiel kaum noch um weitere Teilnehmer erweitern.
			</p>

			<p>
				Die Verpflegung am Abend erfolgt ausschließlich über den Spieletreff. Gegen einen geringen Unkostenbeitrag werden Getränke gestellt. Der Überschuss geht als Spende an das evangelische Gemeindehaus bzw. das DRK-Heim zur Deckung der Unterhaltskosten (Heizung, Reinigung, Abnutzung der Räume). Und fast immer schaut der Pizzaservice kurz vorbei.
			</p>

			<p>
				Wer mitspielen möchte, sollte 16 Jahre oder älter sein. Der Altersdurchschnitt liegt zurzeit bei etwa 30 Jahren. Eine Mitgliedschaft beim DRK oder der evangelischen Gemeinde ist keine Voraussetzung. Die Gruppe freut sich über jeden neuen Mitspieler – je mehr Leute, desto mehr Spaß!
			</p>
		</div>
	</section>

	<!-- Photo Gallery -->
	<section class="px-8 py-16 bg-surface-container">
		<div class="max-w-6xl mx-auto">
			<div class="max-w-4xl mb-10">
				<p class="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Eindrücke</p>
				<h2 class="text-2xl font-extrabold font-headline text-on-surface">Bilder vom Spieleabend</h2>
			</div>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
			{#each photos as photo (photo.src)}
				<div class="overflow-hidden rounded-xl group">
					<img
						src={photo.src}
						alt={photo.alt}
						loading="lazy"
						width="941"
						height="628"
						class="w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>
			{/each}
		</div>
		<p class="text-xs text-on-surface-variant/60 mt-4">Aufnahmen aus unseren Spieleabenden in Brochterbeck, 2015.</p>
		</div>
	</section>

	<!-- Closing CTA -->
	<section class="bg-surface-container-low px-8 py-16 md:py-20">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-3xl font-extrabold font-headline text-on-surface mb-3 leading-tight">
				Komm einfach vorbei.
			</h2>
			<p class="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-xl">
				Kein Mitgliedsbeitrag, keine Anmeldepflicht – schau dir den nächsten Termin an und setz dich dazu.
			</p>
			<div class="flex flex-wrap gap-4">
				<a
					href="{base}/kalender"
					class="ui-button inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-base"
				>
					<span class="material-symbols-outlined text-xl leading-none" aria-hidden="true">calendar_month</span>
					Nächsten Termin ansehen
				</a>
				<a
					href="https://chat.whatsapp.com/2naM3nPDYs08qymMxBIE8v?mode=gi_t"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp-Gruppe beitreten (öffnet extern)"
					class="ui-button inline-flex items-center gap-2 bg-surface-container text-on-surface px-6 py-3 rounded-lg font-bold text-base"
				>
					<span class="material-symbols-outlined text-xl leading-none" aria-hidden="true">forum</span>
					WhatsApp-Gruppe
					<span class="material-symbols-outlined text-sm leading-none" aria-hidden="true">open_in_new</span>
				</a>
			</div>
		</div>
	</section>

</main>
