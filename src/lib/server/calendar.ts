import type { CalendarEvent } from '$lib/types';

const CALENDAR_ID =
	'5d1d857bdfe446b6f66f5a77351958678182bac29942538a178a113dd8e7a7fb@group.calendar.google.com';

const ICAL_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
	const response = await fetch(ICAL_URL);
	if (!response.ok) {
		throw new Error(`Google Calendar fetch failed: ${response.status} ${response.statusText}`);
	}
	const text = await response.text();
	return parseIcal(text);
}

// Unfold iCal line continuations (CRLF + whitespace = logical continuation)
function unfoldLines(text: string): string[] {
	return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r\n|\n/);
}

function unescape(value: string): string {
	return value.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

function parseDate(key: string, value: string): { date: Date; allDay: boolean } {
	const isAllDay = key.includes('VALUE=DATE') || value.length === 8;

	if (isAllDay) {
		// DATE: YYYYMMDD — treat as midnight local
		return {
			date: new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`),
			allDay: true
		};
	}

	if (value.endsWith('Z')) {
		// UTC datetime
		return {
			date: new Date(
				`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}Z`
			),
			allDay: false
		};
	}

	// Floating / TZID local datetime — parse without explicit TZ
	return {
		date: new Date(
			`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}`
		),
		allDay: false
	};
}

type RawEvent = Partial<CalendarEvent> & {
	rrule?: string;
	exdates?: Date[];
	rdates?: Date[];
};

function parseRRule(rrule: string): Record<string, string> {
	const result: Record<string, string> = {};
	for (const part of rrule.split(';')) {
		const [k, v] = part.split('=');
		if (k && v) result[k] = v;
	}
	return result;
}

function parseWeekdayToken(token: string): { nth: number | null; day: number } | null {
	const match = token.match(/^([+-]?\d)?(MO|TU|WE|TH|FR|SA|SU)$/);
	if (!match) return null;
	const dayMap: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
	return { nth: match[1] ? Number(match[1]) : null, day: dayMap[match[2]] };
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): Date | null {
	if (nth > 0) {
		const firstOfMonth = new Date(year, month, 1);
		const delta = (weekday - firstOfMonth.getDay() + 7) % 7;
		const day = 1 + delta + (nth - 1) * 7;
		const candidate = new Date(year, month, day);
		return candidate.getMonth() === month ? candidate : null;
	}

	// e.g. -1FR => last Friday of month
	const lastOfMonth = new Date(year, month + 1, 0);
	const delta = (lastOfMonth.getDay() - weekday + 7) % 7;
	const day = lastOfMonth.getDate() - delta + (nth + 1) * 7;
	const candidate = new Date(year, month, day);
	return candidate.getMonth() === month ? candidate : null;
}

function withTimeFrom(datePart: Date, timePart: Date): Date {
	return new Date(
		datePart.getFullYear(),
		datePart.getMonth(),
		datePart.getDate(),
		timePart.getHours(),
		timePart.getMinutes(),
		timePart.getSeconds(),
		timePart.getMilliseconds()
	);
}

function expandRecurringEvent(raw: RawEvent): CalendarEvent[] {
	if (!raw.uid || !raw.title || !raw.start || !raw.end) return [];
	if (!raw.rrule) return [raw as CalendarEvent];

	const rule = parseRRule(raw.rrule);
	const freq = rule.FREQ;
	if (!freq) return [raw as CalendarEvent];

	const interval = Number(rule.INTERVAL || '1');
	const until = rule.UNTIL ? parseDate('DTSTART', rule.UNTIL).date : null;
	const count = rule.COUNT ? Number(rule.COUNT) : null;
	const durationMs = raw.end.getTime() - raw.start.getTime();
	const exdates = new Set((raw.exdates ?? []).map((d) => d.getTime()));
	const rdates = raw.rdates ?? [];

	const occurrences: Date[] = [];
	const addOccurrence = (d: Date) => {
		const ts = d.getTime();
		if (until && ts > until.getTime()) return;
		if (exdates.has(ts)) return;
		if (!occurrences.some((o) => o.getTime() === ts)) occurrences.push(d);
	};

	// DTSTART is always part of the recurrence set.
	addOccurrence(raw.start);

	if (freq === 'DAILY') {
		let i = 1;
		while (i < 1000) {
			const d = new Date(raw.start);
			d.setDate(d.getDate() + i * interval);
			if (until && d > until) break;
			addOccurrence(d);
			if (count && occurrences.length >= count) break;
			i += 1;
		}
	} else if (freq === 'WEEKLY') {
		const bydayTokens = (rule.BYDAY ?? '')
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		const weekdays = bydayTokens.length
			? bydayTokens.map((t) => parseWeekdayToken(t)?.day).filter((d): d is number => d !== undefined)
			: [raw.start.getDay()];

		let week = 0;
		while (week < 520) {
			const weekStart = new Date(raw.start);
			weekStart.setDate(weekStart.getDate() + week * interval * 7);
			for (const wd of weekdays) {
				const d = new Date(weekStart);
				const delta = (wd - weekStart.getDay() + 7) % 7;
				d.setDate(d.getDate() + delta);
				addOccurrence(d);
				if (count && occurrences.length >= count) break;
			}
			if (count && occurrences.length >= count) break;
			if (until && weekStart > until) break;
			week += 1;
		}
	} else if (freq === 'MONTHLY') {
		const bydayTokens = (rule.BYDAY ?? '')
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		let monthOffset = 0;
		while (monthOffset < 240) {
			const d = new Date(raw.start);
			d.setMonth(d.getMonth() + monthOffset * interval);
			const year = d.getFullYear();
			const month = d.getMonth();

			if (bydayTokens.length) {
				for (const token of bydayTokens) {
					const parsed = parseWeekdayToken(token);
					if (!parsed) continue;

					const nth = parsed.nth ?? 1;
					const dayInMonth = nthWeekdayOfMonth(year, month, parsed.day, nth);
					if (!dayInMonth) continue;
					addOccurrence(withTimeFrom(dayInMonth, raw.start));
					if (count && occurrences.length >= count) break;
				}
			} else {
				addOccurrence(new Date(year, month, raw.start.getDate(), raw.start.getHours(), raw.start.getMinutes(), raw.start.getSeconds()));
			}

			if (count && occurrences.length >= count) break;
			if (until && d > until) break;
			monthOffset += 1;
		}
	}

	for (const rdate of rdates) addOccurrence(rdate);

	occurrences.sort((a, b) => a.getTime() - b.getTime());
	if (count) occurrences.splice(count);

	return occurrences.map((startDate) => ({
		uid: `${raw.uid}#${startDate.toISOString()}`,
		title: raw.title!,
		start: startDate,
		end: new Date(startDate.getTime() + durationMs),
		allDay: raw.allDay ?? false,
		description: raw.description,
		location: raw.location
	}));
}

function parseIcal(text: string): CalendarEvent[] {
	const rawEvents: RawEvent[] = [];
	const lines = unfoldLines(text);

	let evt: RawEvent | null = null;

	for (const line of lines) {
		if (line === 'BEGIN:VEVENT') {
			evt = {};
			continue;
		}

		if (line === 'END:VEVENT') {
			if (evt?.uid && evt.title && evt.start && evt.end) {
				rawEvents.push(evt);
			}
			evt = null;
			continue;
		}

		if (!evt) continue;

		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) continue;

		const key = line.substring(0, colonIdx);
		const value = line.substring(colonIdx + 1);
		const baseKey = key.split(';')[0];

		switch (baseKey) {
			case 'UID':
				evt.uid = value;
				break;
			case 'SUMMARY':
				evt.title = unescape(value);
				break;
			case 'DTSTART': {
				const { date, allDay } = parseDate(key, value);
				evt.start = date;
				evt.allDay = allDay;
				break;
			}
			case 'DTEND': {
				evt.end = parseDate(key, value).date;
				break;
			}
			case 'DESCRIPTION':
				evt.description = unescape(value);
				break;
			case 'LOCATION':
				evt.location = unescape(value);
				break;
			case 'RRULE':
				evt.rrule = value;
				break;
			case 'EXDATE': {
				evt.exdates ??= [];
				for (const item of value.split(',')) {
					evt.exdates.push(parseDate(key, item).date);
				}
				break;
			}
			case 'RDATE': {
				evt.rdates ??= [];
				for (const item of value.split(',')) {
					evt.rdates.push(parseDate(key, item).date);
				}
				break;
			}
		}
	}

	const events = rawEvents.flatMap(expandRecurringEvent);
	return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}
