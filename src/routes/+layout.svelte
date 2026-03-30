<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/site/Footer.svelte';
	import Header from '$lib/components/site/Header.svelte';
	import '../app.css';
	import { calendarStore } from '$lib/events.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();

	// Initialise the global reactive store with events fetched at build time.
	// Wrapped in $effect so Svelte tracks the data.events dependency correctly.
	$effect(() => {
		calendarStore.init(data.events);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header currentPath={page.url.pathname} />
<div class="pt-24 bg-surface">
	{@render children()}
</div>
<Footer />
