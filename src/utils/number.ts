export const expToNumber = (number: number): string | undefined => {
	if (!number || typeof number !== 'number') return
	if (!number.toString()?.includes('e')) return number.toString() || undefined

	if (Math.abs(number) < 1.0) {
		const exp = parseInt(number.toString().split('e-')[1])
		if (exp) {
			number *= Math.pow(10, exp - 1)
			return (
				'0.' + new Array(exp).join('0') + number.toString().substring(2)
			)
		}
	} else {
		let exp = parseInt(number.toString().split('+')[1])
		if (exp > 20) {
			exp -= 20
			number /= Math.pow(10, exp)
			return new Array(exp + 1).join('0')
		}
	}
}

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
		(decimals ? '.' + decimals : '')
	)
}

export const safeMultiplication = (
	n1: number,
	n2: number,
	cf: number = 10
): number | undefined => {
	if (
		!n1 ||
		!n2 ||
		typeof n1 !== 'number' ||
		typeof n2 !== 'number' ||
		(cf && typeof cf !== 'number')
	) {
		return
	}

	return (n1 * cf * (n2 * cf)) / Math.pow(cf, 2)
}
