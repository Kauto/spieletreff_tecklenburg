import type { CalendarEvent } from '$lib/types';

// Global reactive store for calendar events.
// Populated by +layout.svelte from server-loaded data at build time.
let _events = $state<CalendarEvent[]>([]);

export const calendarStore = {
	get events(): CalendarEvent[] {
		return _events;
	},

	/** Called once in +layout.svelte with the prerendered server data. */
	init(events: CalendarEvent[]) {
		_events = events;
	},

	/** Upcoming events (today and later), sorted ascending. */
	get upcoming(): CalendarEvent[] {
		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		return _events.filter((e) => e.end >= todayStart);
	},

	/** The next single event, or undefined if none. */
	get next(): CalendarEvent | undefined {
		return this.upcoming[0];
	}
};
