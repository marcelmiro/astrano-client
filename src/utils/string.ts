const RANDOM_STRING_LENGTH = 4
export const generateRandomId = (length: number = 8) => {
	const repeatTimes = Math.ceil(length / RANDOM_STRING_LENGTH)
	const idSubstrings: string[] = []

	for (let i = 0; i < repeatTimes; i++) {
		idSubstrings.push(
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1)
		)
	}

	return idSubstrings.join('').slice(0, length)
}
