// https://gist.github.com/pstoica/4323d3e6e37e8a23dd59
export const handleBlur = (
	e: React.ChangeEvent<HTMLElement>,
	callback: () => void
) => {
	const currentTarget = e.currentTarget
	setTimeout(() => {
		if (!currentTarget.contains(document.activeElement)) callback()
	}, 0)
}

export const copyToClipboard = async (text: string) => {
	if (!text) return
	try {
		await navigator.clipboard.writeText(text)
	} catch (e) {
		const listener = (e: ClipboardEvent) => {
			e.preventDefault()
			e.clipboardData?.setData('text/plain', text)
		}
		document.addEventListener('copy', listener)
		document.execCommand('copy')
		document.removeEventListener('copy', listener)
		/* const el = document.createElement('textarea')
		el.value = text
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		document.body.appendChild(el)
		try {
			el.select()
			document.execCommand('copy')
		} catch (e) {
			console.error('Can\'t copy value to clipboard.')
		} finally { document.body.removeChild(el) } */
	}
	return true
}
