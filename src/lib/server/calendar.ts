import type { CalendarEvent } from '$lib/types';

const CALENDAR_ID =
	'5d1d857bdfe446b6f66f5a77351958678182bac29942538a178a113dd8e7a7fb@group.calendar.google.com';

const ICAL_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10_000);
		const response = await fetch(ICAL_URL, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			console.warn(`Google Calendar fetch failed: ${response.status} ${response.statusText}`);
			return [];
		}
		const text = await response.text();
		return parseIcal(text);
	} catch (e) {
		console.warn('Google Calendar fetch error:', e);
		return [];
	}
}

// Unfold iCal line continuations (CRLF + whitespace = logical continuation)
function unfoldLines(text: string): string[] {
	return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r\n|\n/);
}

function unescape(value: string): string {
	return value.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

/**
 * Converts a wall-clock datetime string (ISO local, no Z suffix) that is in the
 * given IANA timezone into a proper UTC Date. Works on any Node/V8 version that
 * supports Intl.DateTimeFormat.formatToParts.
 */
function parseLocalInTimezone(localIso: string, tzid: string): Date {
	// Treat the local time as if it were UTC so we have a Date to pass to Intl.
	const assumedUtc = new Date(localIso + 'Z');

	// Format that UTC instant as a broken-down date/time in the target timezone.
	const parts = Object.fromEntries(
		new Intl.DateTimeFormat('en-CA', {
			timeZone: tzid,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		})
			.formatToParts(assumedUtc)
			.map((p) => [p.type, p.value])
	);

	// Rebuild the date string from parts and parse it as UTC to get the TZ offset.
	const hour = parts.hour === '24' ? '00' : parts.hour;
	const tzAsUtc = new Date(
		`${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}Z`
	);

	// offset = (local time treated as UTC) - (what that UTC time looks like in tzid)
	// Applying the offset converts our "assumed UTC" to the real UTC instant.
	const offsetMs = assumedUtc.getTime() - tzAsUtc.getTime();
	return new Date(assumedUtc.getTime() + offsetMs);
}

function parseDate(key: string, value: string): { date: Date; allDay: boolean } {
	const isAllDay = key.includes('VALUE=DATE') || value.length === 8;

	if (isAllDay) {
		// DATE: YYYYMMDD — noon UTC avoids any date-line ambiguity during display
		return {
			date: new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T12:00:00Z`),
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

	const localIso = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}`;

	// Extract TZID parameter, e.g. DTSTART;TZID=Europe/Berlin
	const tzidMatch = key.match(/TZID=([^;:]+)/);
	if (tzidMatch) {
		return { date: parseLocalInTimezone(localIso, tzidMatch[1]), allDay: false };
	}

	// Truly floating datetime (no TZID, no Z) — assume Europe/Berlin as the
	// calendar is German and Google Calendar always sets TZID, so this is a fallback.
	return { date: parseLocalInTimezone(localIso, 'Europe/Berlin'), allDay: false };
}

type RawEvent = Partial<CalendarEvent> & {
	rrule?: string;
	exdates?: Date[];
	rdates?: Date[];
	durationMs?: number;
};

/** Parses iCal DURATION values such as PT5H, P1D, or PT1H30M into milliseconds. */
function parseDuration(value: string): number {
	const match = value.match(/^P(?:(\d+)W|(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?)$/);
	if (!match) return 0;

	const weeks = Number(match[1] || 0);
	const days = Number(match[2] || 0);
	const hours = Number(match[3] || 0);
	const minutes = Number(match[4] || 0);
	const seconds = Number(match[5] || 0);

	return (((weeks * 7 + days) * 24 + hours) * 60 + minutes) * 60 * 1000 + seconds * 1000;
}

/** Derives DTEND when Google Calendar omits it (common for open-ended or all-day events). */
function resolveEventEnd(raw: RawEvent): Date | undefined {
	if (raw.end) return raw.end;
	if (!raw.start) return undefined;

	if (raw.durationMs) {
		return new Date(raw.start.getTime() + raw.durationMs);
	}

	// All-day DTEND is exclusive; default to a single day when omitted.
	if (raw.allDay) {
		const end = new Date(raw.start);
		end.setUTCDate(end.getUTCDate() + 1);
		return end;
	}

	// Timed event without end/duration: zero-length instant (RFC 5545).
	return new Date(raw.start.getTime());
}

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
	if (!raw.uid || !raw.title || !raw.start) return [];

	const end = resolveEventEnd(raw);
	if (!end) return [];

	const normalized = { ...raw, end };
	if (!normalized.rrule) return [normalized as CalendarEvent];

	const rule = parseRRule(normalized.rrule);
	const freq = rule.FREQ;
	if (!freq) return [normalized as CalendarEvent];

	const interval = Number(rule.INTERVAL || '1');
	const until = rule.UNTIL ? parseDate('DTSTART', rule.UNTIL).date : null;
	const count = rule.COUNT ? Number(rule.COUNT) : null;
	const durationMs = end.getTime() - normalized.start!.getTime();
	const exdates = new Set((normalized.exdates ?? []).map((d) => d.getTime()));
	const rdates = normalized.rdates ?? [];

	const occurrences: Date[] = [];
	const addOccurrence = (d: Date) => {
		const ts = d.getTime();
		if (until && ts > until.getTime()) return;
		if (exdates.has(ts)) return;
		if (!occurrences.some((o) => o.getTime() === ts)) occurrences.push(d);
	};

	// DTSTART is always part of the recurrence set.
	addOccurrence(normalized.start!);

	if (freq === 'DAILY') {
		let i = 1;
		while (i < 1000) {
			const d = new Date(normalized.start!);
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
			: [normalized.start!.getDay()];

		let week = 0;
		while (week < 520) {
			const weekStart = new Date(normalized.start!);
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
			const d = new Date(normalized.start!);
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
					addOccurrence(withTimeFrom(dayInMonth, normalized.start!));
					if (count && occurrences.length >= count) break;
				}
			} else {
				addOccurrence(new Date(year, month, normalized.start!.getDate(), normalized.start!.getHours(), normalized.start!.getMinutes(), normalized.start!.getSeconds()));
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
		uid: `${normalized.uid}#${startDate.toISOString()}`,
		title: normalized.title!,
		start: startDate,
		end: new Date(startDate.getTime() + durationMs),
		allDay: normalized.allDay ?? false,
		description: normalized.description,
		location: normalized.location
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
			if (evt?.uid && evt.title && evt.start) {
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
			case 'DURATION':
				evt.durationMs = parseDuration(value);
				break;
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
