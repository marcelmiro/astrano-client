import React, { forwardRef, useRef, RefCallback, ForwardedRef } from 'react'
import { RefCallBack } from 'react-hook-form'

interface TextareaAutoHeightProps {
	onChange?(e: React.ChangeEvent<HTMLTextAreaElement>): void
	[key: string]: any
}

export default forwardRef<RefCallBack | undefined, TextareaAutoHeightProps>(
	function TextareaAutoHeight({ onChange, ...props }, ref) {
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

		const extendRef = (e: any) => {
			if (typeof ref === 'function') ref(e)
			innerRef.current = e
		}

		return (
			<textarea
				onChange={handleChange}
				ref={extendRef}
				{...props}
			></textarea>
		)
	}
)
