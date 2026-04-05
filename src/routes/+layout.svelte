<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/site/Footer.svelte';
	import Header from '$lib/components/site/Header.svelte';
	import '../app.css';
	import { calendarStore } from '$lib/events.svelte';

	let { children, data } = $props();

	$effect(() => {
		calendarStore.init(data.events);
	});

	const ogImage = $derived(`${page.url.origin}${base}/images/spieletreff-hero.jpg`);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<meta name="theme-color" content="#2E3A8C" />
	<meta name="robots" content="index, follow" />
	<meta name="author" content="Spieletreff Tecklenburger Land" />
	<meta property="og:site_name" content="Spieletreff Tecklenburg" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="941" />
	<meta property="og:image:height" content="628" />
	<meta property="og:image:alt" content="Brettspiel-Figuren und Würfel auf einem Holztisch beim Spieletreff Tecklenburg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImage} />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<Header currentPath={page.url.pathname} />
<div class="pt-16 bg-surface">
	{@render children()}
</div>
<Footer />
