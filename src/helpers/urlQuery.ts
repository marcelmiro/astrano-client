import { NextRouter } from 'next/router'

const ARRAY_SEPARATOR = '|'

export const getItem = (
	router: NextRouter,
	key: string
): string | string[] | undefined => {
	if (!key || !router || !router.isReady) return
	let value = router.query[key]
	if (value && typeof value === 'string' && value.includes(ARRAY_SEPARATOR)) {
		value = value.split(ARRAY_SEPARATOR)
	}
	return value
}

export const getItems = (
	router: NextRouter,
	keys: string[]
): (string | string[] | undefined)[] => {
	if (!keys || !router || !router.isReady) return []
	keys = keys.filter((key) => key && typeof key === 'string')
	if (keys.length === 0) return []

	const valueArray = []
	for (const key of keys) {
		let value = router.query[key]
		if (
			value &&
			typeof value === 'string' &&
			value.includes(ARRAY_SEPARATOR)
		) {
			value = value.split(ARRAY_SEPARATOR)
		}
		valueArray.push(value)
	}
	return valueArray
}

export const addItems = (
	router: NextRouter,
	values: Record<string, string | string[] | undefined>,
	shallow = true
) => {
	if (
		!values ||
		Object.keys(values).length === 0 ||
		!router ||
		!router.isReady
	) {
		return
	}

	const { query } = router
	for (let [key, value] of Object.entries(values)) {
		if (!value) delete query[key]
		else if (Array.isArray(value)) {
			if (value.length === 0) delete query[key]
			else query[key] = value.join(ARRAY_SEPARATOR) || undefined
		} else query[key] = value || undefined
	}

	router.push({ query }, undefined, { shallow })
}
