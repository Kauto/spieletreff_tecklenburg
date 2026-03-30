import { fetchCalendarEvents } from '$lib/server/calendar';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = async () => {
	const events = await fetchCalendarEvents();
	return { events };
};
