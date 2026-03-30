export function cleanLocation(location: string): string {
	return location
		.split(',')
		.map((part) => part.trim())
		.filter((part) => part.length > 0 && part.toLowerCase() !== 'deutschland')
		.join(', ');
}

export function locationOrUndefined(location?: string): string | undefined {
	if (!location) return undefined;
	const cleaned = cleanLocation(location);
	return cleaned.length > 0 ? cleaned : undefined;
}
