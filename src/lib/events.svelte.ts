import type { CalendarEvent } from '#lib/types.js';

// Global reactive store for calendar events.
// Populated by +layout.svelte from server-loaded data at build time.
let _events = $state<CalendarEvent[]>([]);

/** True when the title starts with "Abgesagt" (any casing). */
export function isCancelledEvent(event: Pick<CalendarEvent, 'title'>): boolean {
	return /^\s*abgesagt\b/i.test(event.title);
}

/** Title without a leading "Abgesagt" prefix (for friendly display). */
export function displayEventTitle(event: Pick<CalendarEvent, 'title'>): string {
	if (!isCancelledEvent(event)) return event.title;
	const stripped = event.title.replace(/^\s*abgesagt\b[!?.:]?\s*/i, '').trim();
	return stripped || event.title;
}

function reviveEvent(event: CalendarEvent): CalendarEvent {
	return {
		...event,
		start: event.start instanceof Date ? event.start : new Date(event.start),
		end: event.end instanceof Date ? event.end : new Date(event.end)
	};
}

export const calendarStore = {
	get events(): CalendarEvent[] {
		return _events;
	},

	/** Called from +layout.svelte with the prerendered server data. */
	init(events: CalendarEvent[]) {
		_events = events.map(reviveEvent);
	},

	/** Upcoming events through the end of next year, including cancellations. */
	get upcoming(): CalendarEvent[] {
		// These are transient snapshots used only for filtering, not reactive state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const now = new Date();
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const startOfYearAfterNext = new Date(now.getFullYear() + 2, 0, 1);
		return _events.filter((e) => e.start >= todayStart && e.start < startOfYearAfterNext);
	},

	/** Upcoming events that are not cancelled. */
	get upcomingActive(): CalendarEvent[] {
		return this.upcoming.filter((e) => !isCancelledEvent(e));
	},

	/** Next meeting visitors should attend (skips cancelled titles). */
	get next(): CalendarEvent | undefined {
		return this.upcomingActive[0];
	},

	/**
	 * When the chronologically next upcoming event is cancelled, return it so
	 * the UI can show a prominent "don't come" notice.
	 */
	get nextCancellation(): CalendarEvent | undefined {
		const first = this.upcoming[0];
		return first && isCancelledEvent(first) ? first : undefined;
	}
};
