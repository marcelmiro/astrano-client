const THOUSAND_SEPARATOR = ','

export const addThousandSeparator = (
	number: number | string
): string | undefined => {
	if (!number) return

	if (typeof number === 'number') number = number.toString()
	else if (typeof number !== 'string') return

	const [integer, decimals] = number.split('.')
	return (
		integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSAND_SEPARATOR) +
		(typeof decimals === 'string' ? '.' + decimals : '')
	)
}

export const isNumber = (number: unknown): boolean => {
	if (number === 0) return true
	if (!number) return false
	if (typeof number === 'string') number = parseInt(number)
	if (typeof number !== 'number') return false
	return Boolean(number || number === 0)
}
