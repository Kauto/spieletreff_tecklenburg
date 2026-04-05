<script lang="ts">
	import apartmentSvg from '@material-symbols/svg-400/outlined/apartment.svg?raw';
	import arrowForwardSvg from '@material-symbols/svg-400/outlined/arrow_forward.svg?raw';
	import arrowOutwardSvg from '@material-symbols/svg-400/outlined/arrow_outward.svg?raw';
	import calendarMonthSvg from '@material-symbols/svg-400/outlined/calendar_month.svg?raw';
	import casinoSvg from '@material-symbols/svg-400/outlined/casino.svg?raw';
	import casinoFillSvg from '@material-symbols/svg-400/outlined/casino-fill.svg?raw';
	import checkCircleSvg from '@material-symbols/svg-400/outlined/check_circle.svg?raw';
	import closeSvg from '@material-symbols/svg-400/outlined/close.svg?raw';
	import cloudOffSvg from '@material-symbols/svg-400/outlined/cloud_off.svg?raw';
	import editNoteSvg from '@material-symbols/svg-400/outlined/edit_note.svg?raw';
	import eventSvg from '@material-symbols/svg-400/outlined/event.svg?raw';
	import eventBusySvg from '@material-symbols/svg-400/outlined/event_busy.svg?raw';
	import eventUpcomingSvg from '@material-symbols/svg-400/outlined/event_upcoming.svg?raw';
	import expandMoreSvg from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg?raw';
	import forumSvg from '@material-symbols/svg-400/outlined/forum.svg?raw';
	import homeSvg from '@material-symbols/svg-400/outlined/home.svg?raw';
	import locationOnSvg from '@material-symbols/svg-400/outlined/location_on.svg?raw';
	import menuSvg from '@material-symbols/svg-400/outlined/menu.svg?raw';
	import openInNewSvg from '@material-symbols/svg-400/outlined/open_in_new.svg?raw';
	import refreshSvg from '@material-symbols/svg-400/outlined/refresh.svg?raw';
	import scheduleSvg from '@material-symbols/svg-400/outlined/schedule.svg?raw';
	import todaySvg from '@material-symbols/svg-400/outlined/today.svg?raw';
	import warningSvg from '@material-symbols/svg-400/outlined/warning.svg?raw';

	const svgs: Record<string, string> = {
		apartment: apartmentSvg,
		arrow_forward: arrowForwardSvg,
		arrow_outward: arrowOutwardSvg,
		calendar_month: calendarMonthSvg,
		casino: casinoSvg,
		check_circle: checkCircleSvg,
		close: closeSvg,
		cloud_off: cloudOffSvg,
		edit_note: editNoteSvg,
		event: eventSvg,
		event_busy: eventBusySvg,
		event_upcoming: eventUpcomingSvg,
		expand_more: expandMoreSvg,
		forum: forumSvg,
		home: homeSvg,
		location_on: locationOnSvg,
		menu: menuSvg,
		open_in_new: openInNewSvg,
		refresh: refreshSvg,
		schedule: scheduleSvg,
		today: todaySvg,
		warning: warningSvg
	};

	interface Props {
		name: string;
		fill?: boolean;
		class?: string;
	}

	let { name, fill = false, class: className = '' }: Props = $props();

	const src = $derived(fill && name === 'casino' ? casinoFillSvg : (svgs[name] ?? ''));
</script>

{#if src}
	<span class={['icon inline-block align-middle shrink-0', className]} aria-hidden="true"
		>{@html src}</span
	>
{/if}

<style>
	.icon :global(svg) {
		width: 1em;
		height: 1em;
		fill: currentColor;
		display: block;
	}
</style>
