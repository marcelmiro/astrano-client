const KEY_PREFIX = 'astrano.'
const OBJECT_SEPARATOR = '.'
const OBJECT_REGEX = new RegExp(`\\b${OBJECT_SEPARATOR}\\b`)

function getKey(key: string) {
	return KEY_PREFIX + key
}

export function getItem(key: string): any {
	// Check if localStorage object exists
	if (typeof window === 'undefined') return

	if (!key || typeof key !== 'string') return

	// Separate key string to key and object property values
	let objectProp: string | undefined
	if (OBJECT_REGEX.test(key)) {
		const separatorIndex = key.indexOf(OBJECT_SEPARATOR)
		objectProp = key.slice(separatorIndex + 1, key.length)
		key = key.slice(0, separatorIndex)
	}

	let value = localStorage.getItem(getKey(key))
	if (!value) return
	try {
		const parsedValue = JSON.parse(value)
		return objectProp ? parsedValue[objectProp] : parsedValue
	} catch (e) {
		return value
	}
}

export function setItem(key: string, value: any) {
	// Check if localStorage object exists
	if (typeof window === 'undefined') return
	
	if (!key || typeof key !== 'string') return
    let bv = value

	// Separate key string to key and object property values
	let objectProp: string | undefined
	if (OBJECT_REGEX.test(key)) {
		const separatorIndex = key.indexOf(OBJECT_SEPARATOR)
		objectProp = key.slice(separatorIndex + 1, key.length)
		key = key.slice(0, separatorIndex)
	}

	if (objectProp) {
		const storageValue = getItem(key)
		if (storageValue) {
            // Update item with new property value
			value = { ...storageValue, [objectProp]: value }
		} else if (value) {
            // If value exists, create new local storage item object
			value = { [objectProp]: value }
		} else {
            // No item exists to update and value already doesn't exist
            return
        }
	} else if (!value) {
		// Delete from local storage if value doesn't exist
		return deleteItem(key)
	}

	// Stringify, compress and store item
	if (typeof value !== 'string') value = JSON.stringify(value)
	return localStorage.setItem(getKey(key), value)
}

export function deleteItem(key: string) {
	// Check if localStorage object exists
	if (typeof window === 'undefined') return
	
	if (!key || typeof key !== 'string') return
	return localStorage.removeItem(getKey(key))
}
