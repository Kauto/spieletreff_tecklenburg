// Öffentlicher Google-Kalender des Spieletreffs.
// Dieselbe ID nutzt src/lib/server/calendar.ts zum Einlesen der Termine.
export const CALENDAR_ID =
	'5d1d857bdfe446b6f66f5a77351958678182bac29942538a178a113dd8e7a7fb@group.calendar.google.com';

/** iCal-Adresse (ICS) des öffentlichen Kalenders. */
export const CALENDAR_ICAL_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;

/** Abo-Link für Apple-Kalender (iPhone/Mac), Outlook und andere Kalender-Apps. */
export const CALENDAR_WEBCAL_URL = CALENDAR_ICAL_URL.replace(/^https:/, 'webcal:');

/** Fügt den Kalender im Google Kalender (auch Android) als Abo hinzu. */
export const CALENDAR_GOOGLE_SUBSCRIBE_URL = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_ID)}`;
