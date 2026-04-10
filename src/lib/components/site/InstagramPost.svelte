<script lang="ts">
	interface Props {
		shortcode: string;
		caption?: string;
		profileUrl?: string;
	}

	let {
		shortcode,
		caption = '',
		profileUrl = 'https://www.instagram.com/spielteckland'
	}: Props = $props();

	let consentGiven = $state(false);

	const postUrl = $derived(`https://www.instagram.com/p/${shortcode}/`);
	const embedUrl = $derived(`https://www.instagram.com/p/${shortcode}/embed/`);

	const instagramPath =
		'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z';
</script>

<div class="w-full max-w-sm mx-auto">
	{#if consentGiven}
		<div class="rounded-2xl overflow-hidden shadow-lg border border-outline-variant/40 bg-surface-container-lowest">
			<iframe
				src={embedUrl}
				title="Instagram-Post von @spielteckland"
				class="w-full border-0"
				style="min-height: 540px;"
				loading="lazy"
				scrolling="no"
				frameborder="0"
				allowtransparency="true"
			></iframe>
		</div>
	{:else}
		<div
			class="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-lg"
			aria-label="Instagram-Post – Vorschau nicht geladen (Datenschutz)"
		>
			<!-- Instagram-style header -->
			<div class="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/30">
				<div
					class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shrink-0"
				>
					<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d={instagramPath} />
					</svg>
				</div>
				<div class="min-w-0">
					<p class="text-sm font-bold text-on-surface leading-none">spielteckland</p>
					<p class="text-xs text-on-surface-variant mt-0.5">Spieletreff Tecklenburger Land</p>
				</div>
				<a
					href={profileUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="@spielteckland auf Instagram folgen (öffnet extern)"
					class="ml-auto shrink-0 text-xs font-bold text-primary hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
				>
					Folgen
				</a>
			</div>

			<!-- Placeholder visual -->
			<div
				class="aspect-square bg-surface-container flex flex-col items-center justify-center gap-4 px-8 text-center"
			>
				<div
					class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center opacity-20"
				>
					<svg
						class="w-8 h-8 text-white"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d={instagramPath} />
					</svg>
				</div>
				<p class="text-sm text-on-surface-variant leading-relaxed">
					Instagram-Inhalte werden aus Datenschutzgründen erst nach deiner Zustimmung geladen.
				</p>
				<button
					type="button"
					class="ui-button mt-1 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
					onclick={() => (consentGiven = true)}
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d={instagramPath} />
					</svg>
					Post anzeigen
				</button>
				<p class="text-xs text-on-surface-variant/70">
					Es werden Daten an Meta (Instagram) übermittelt. Mehr dazu in unserer
					<a
						href="/datenschutz"
						class="underline hover:text-on-surface-variant rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
					>Datenschutzerklärung</a>.
				</p>
			</div>

			<!-- Post link footer -->
			<div class="px-4 py-3 border-t border-outline-variant/30">
				{#if caption}
					<p class="text-sm text-on-surface leading-relaxed line-clamp-2">
						<span class="font-bold">spielteckland</span>
						{caption}
					</p>
				{/if}
				<a
					href={postUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Post auf Instagram ansehen (öffnet extern)"
					class="inline-block mt-1 text-xs text-on-surface-variant hover:text-primary hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
				>
					Auf Instagram ansehen →
				</a>
			</div>
		</div>
	{/if}
</div>
