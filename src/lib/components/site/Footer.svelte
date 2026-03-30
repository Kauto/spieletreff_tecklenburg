<script lang="ts">
	import { base } from '$app/paths';
</script>

<footer class="w-full bg-surface-container-low font-body">
	<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-8 py-16 md:grid-cols-4 md:px-12">
		<div class="flex flex-col gap-5">
			<a href="{base}/" class="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
				<img
					src="{base}/images/logo-transparent.png"
					alt="Spieletreff Tecklenburger Land"
					class="h-16 w-auto"
				/>
			</a>
			<p class="text-base leading-relaxed text-on-surface-variant">
				Offene Brettspielrunde im Tecklenburger Land – seit 2009. Kostenlos, ohne Anmeldung.
			</p>
		</div>
		<div class="flex flex-col gap-4">
			<h4 class="font-headline text-xs font-bold uppercase tracking-widest text-primary">Seiten</h4>
			<ul class="space-y-2">
				<li><a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="{base}/">Home</a></li>
				<li><a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="{base}/kalender">Kalender</a></li>
				<li><a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="{base}/geschichte">Geschichte</a></li>
				<li><a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant/60 text-sm transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="{base}/datenschutz">Datenschutz</a></li>
				<li><a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant/60 text-sm transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="{base}/impressum">Impressum</a></li>
			</ul>
		</div>
		<div class="flex flex-col gap-4">
			<h4 class="font-headline text-xs font-bold uppercase tracking-widest text-primary">Kontakt</h4>
			<p class="text-base text-on-surface-variant">
				Mettingen &amp; Brochterbeck<br />
				Tecklenburger Land<br />
				NRW, Deutschland
			</p>
			<a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 font-bold text-primary transition-colors duration-200 hover:bg-surface-container hover:text-primary/90" href="mailto:spielen@spieletreff-tecklenburgerland.de">
				spielen@spieletreff-tecklenburgerland.de
			</a>
		</div>
		<div class="flex flex-col gap-4">
			<h4 class="font-headline text-xs font-bold uppercase tracking-widest text-primary">Links</h4>
			<ul class="space-y-2">
				<li>
					<a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="https://www.brettspieletreff-lingen.de/" target="_blank" rel="noopener noreferrer">
						Brettspieltreff Lingen
						<span class="link-icon material-symbols-outlined text-base" aria-hidden="true">arrow_outward</span>
					</a>
				</li>
				<li>
					<a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="https://spieltraeumer.de/" target="_blank" rel="noopener noreferrer">
						Spieltraeumer
						<span class="link-icon material-symbols-outlined text-base" aria-hidden="true">arrow_outward</span>
					</a>
				</li>
				<li>
					<a class="footer-link focus-ring min-h-11 inline-flex rounded-xl px-2 py-1 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary" href="https://wp.nrw-spielt.de/" target="_blank" rel="noopener noreferrer">
						NRW spielt
						<span class="link-icon material-symbols-outlined text-base" aria-hidden="true">arrow_outward</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</footer>

<style>
	.footer-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		transition:
			transform 180ms cubic-bezier(0.25, 1, 0.5, 1),
			background-color 200ms ease,
			color 200ms ease;
	}

	.footer-link:hover {
		transform: translateX(2px);
	}

	.footer-link:active {
		transform: translateX(0);
	}

	.focus-ring:focus-visible {
		outline: 2px solid color-mix(in oklab, var(--color-primary) 70%, white);
		outline-offset: 2px;
	}

	.link-icon {
		opacity: 0.55;
		transform: translateX(0);
		transition:
			transform 180ms cubic-bezier(0.25, 1, 0.5, 1),
			opacity 180ms ease;
	}

	.footer-link:hover .link-icon {
		opacity: 1;
		transform: translateX(1px);
	}

	@media (prefers-reduced-motion: reduce) {
		.footer-link {
			transition-duration: 1ms !important;
			transform: none !important;
		}

		.link-icon {
			opacity: 1;
			transform: none !important;
			transition-duration: 1ms !important;
		}
	}
</style>
