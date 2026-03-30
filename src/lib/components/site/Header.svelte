<script lang="ts">
	import { base } from '$app/paths';
	import { quartOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	let { currentPath = '/' } = $props<{ currentPath?: string }>();
	let menuOpen = $state(false);
	const reduceMotion = $derived(prefersReducedMotion.current);

	const navItems = [
		{ href: '/', label: 'Start' },
		{ href: '/kalender', label: 'Kalender' },
		{ href: '/geschichte', label: 'Geschichte' }
	];

	function isActive(href: string): boolean {
		const path = currentPath.replace(base, '') || '/';
		if (href === '/') return path === '/';
		return path.startsWith(href);
	}
</script>

<nav class="fixed top-0 z-50 w-full bg-surface/75 backdrop-blur-xl">
	<div class="mx-auto max-w-7xl px-6 py-4">
		<div class="flex justify-between items-center gap-4">
			<a href="{base}/" class="brand-mark focus-ring flex items-center gap-1.5 rounded-xl font-headline text-xl font-black tracking-tight text-primary md:text-2xl">
				Spieletreff Tecklenburg
				<span class="brand-icon material-symbols-outlined text-base md:text-lg" aria-hidden="true">casino</span>
			</a>
			<div class="hidden md:flex items-center gap-6">
				{#each navItems as item (item.href)}
					<a
						class={`nav-link focus-ring inline-flex items-center min-h-11 rounded-xl px-3 py-2 font-headline text-sm font-bold transition-colors duration-200 ${isActive(item.href) ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
						href="{base}{item.href}"
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/each}
			</div>
			<div class="flex items-center gap-2">
				<a href="{base}/kalender#bevorstehende-termine" class="header-cta focus-ring hidden min-h-11 whitespace-nowrap rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90 md:px-6 md:text-base sm:inline-flex">
					Nächstes Treffen
				</a>
				<button
					type="button"
					class="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container text-on-surface transition-colors duration-200 hover:bg-surface-container-highest md:hidden"
					aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
					aria-expanded={menuOpen}
					onclick={() => (menuOpen = !menuOpen)}
				>
					<span class="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
				</button>
			</div>
		</div>
		{#if menuOpen}
			<div
				in:fly={{ y: reduceMotion ? 0 : -6, duration: reduceMotion ? 0 : 280, easing: quartOut }}
				out:fly={{ y: reduceMotion ? 0 : -4, duration: reduceMotion ? 0 : 180, easing: quartOut }}
				class="mt-3 flex flex-col gap-2 rounded-2xl bg-surface-container p-3 md:hidden"
			>
				{#each navItems as item (item.href)}
					<a
						in:fly={{
							y: reduceMotion ? 0 : -4,
							duration: reduceMotion ? 0 : 260,
							delay: reduceMotion ? 0 : 40,
							easing: quartOut
						}}
						class={`nav-link focus-ring inline-flex items-center min-h-11 rounded-xl px-3 py-2 font-headline font-bold transition-colors duration-200 ${isActive(item.href) ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
						href="{base}{item.href}"
						aria-current={isActive(item.href) ? 'page' : undefined}
						onclick={() => (menuOpen = false)}
					>
						{item.label}
					</a>
				{/each}
				<a href="{base}/kalender#bevorstehende-termine" class="header-cta focus-ring mt-1 inline-flex min-h-11 justify-center rounded-xl bg-primary px-4 py-2.5 font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90" onclick={() => (menuOpen = false)}>
					Nächstes Treffen
				</a>
			</div>
		{/if}
	</div>
</nav>

<style>
	.brand-mark {
		transition:
			transform 220ms cubic-bezier(0.25, 1, 0.5, 1),
			opacity 200ms ease;
	}

	.brand-icon {
		opacity: 0.55;
		transition:
			transform 260ms cubic-bezier(0.25, 1, 0.5, 1),
			opacity 220ms ease;
	}

	.brand-mark:hover .brand-icon {
		opacity: 1;
		transform: rotate(-12deg) translateY(-1px);
	}

	.nav-link {
		transition:
			transform 180ms cubic-bezier(0.25, 1, 0.5, 1),
			background-color 200ms ease,
			color 200ms ease;
	}

	.nav-link:hover {
		transform: translateY(-1px);
	}

	.focus-ring:focus-visible {
		outline: 2px solid color-mix(in oklab, var(--color-primary) 70%, white);
		outline-offset: 2px;
	}

	.header-cta {
		transition:
			transform 160ms cubic-bezier(0.25, 1, 0.5, 1),
			filter 180ms ease,
			background-color 200ms ease;
	}

	.header-cta:hover {
		transform: translateY(-1px) scale(1.01);
		filter: saturate(1.04);
	}

	.header-cta:active {
		transform: translateY(0) scale(0.985);
	}

	@media (prefers-reduced-motion: reduce) {
		.brand-mark,
		.nav-link,
		.header-cta {
			transition-duration: 1ms !important;
			transform: none !important;
			filter: none !important;
		}

		.brand-icon {
			opacity: 1;
		}
	}
</style>
