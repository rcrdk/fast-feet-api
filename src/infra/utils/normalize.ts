/**
 *
 * @param query
 * inform a query string to search into a property
 * @param property
 * inform a property to be searched with query
 * @returns it returns a boolean for a map search
 */
export function normalizeSearch(query: string, property: string) {
	return property
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.includes(
			query
				.toLowerCase()
				.normalize('NFD')
				.replaceAll(/[\u0300-\u036f]/g, ''),
		)
}
