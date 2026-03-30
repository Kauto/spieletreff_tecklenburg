export interface CalendarEvent {
	uid: string;
	title: string;
	start: Date;
	end: Date;
	allDay: boolean;
	description?: string;
	location?: string;
}
