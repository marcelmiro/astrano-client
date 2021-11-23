import React, { forwardRef, RefCallback, useRef } from 'react'

interface TextareaAutoHeightProps {
	onChange?(e: React.ChangeEvent<HTMLTextAreaElement>): void
	[key: string]: unknown
}

export default forwardRef<
	/* eslint-disable @typescript-eslint/no-explicit-any */
	RefCallback<any> | undefined,
	TextareaAutoHeightProps
>(function TextareaAutoHeight({ onChange, ...props }, ref) {
	const innerRef = useRef<HTMLTextAreaElement>()

	const updateTextAreaHeight = () => {
		const el = innerRef.current
		if (!el) return
		el.style.height = 'inherit'
		el.style.height = el.scrollHeight + 2 + 'px'
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(e)
		updateTextAreaHeight()
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	const extendRef = (e: any) => {
		if (typeof ref === 'function') ref(e)
		innerRef.current = e
	}

	return (
		<textarea onChange={handleChange} ref={extendRef} {...props}></textarea>
	)
})
