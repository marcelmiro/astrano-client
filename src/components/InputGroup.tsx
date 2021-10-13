import { useRef, useEffect } from 'react'

import { generateRandomId } from '@/utils/string'

interface InputGroupBase {
	label: string
	description?: string
	value: string
	onChange(value: string): void
	inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
	pattern?: string
	placeholder?: string
	id?: string
	containerClassName?: string
	labelClassName?: string
	inputClassName?: string
	descriptionClassName?: string
}
interface InputGroupTypeString extends InputGroupBase {
	inputType?: 'text' | 'email' | 'password'
	minLength?: number
	maxLength?: number
	textarea?: never
	minHeight?: never
}
interface InputGroupTypeNumber extends InputGroupBase {
	inputType: 'number'
	minLength?: never
	maxLength?: never
	textarea?: never
	minHeight?: never
}
interface InputGroupTextArea extends InputGroupBase {
	textarea: boolean
	minLength?: number
	maxLength?: number
	minHeight?: string
	inputType?: never
}
type InputGroupProps =
	| InputGroupTypeString
	| InputGroupTypeNumber
	| InputGroupTextArea

export default function InputGroup({
	label,
	description,
	textarea,
	inputType = 'text',
	value,
	onChange,
	minLength,
	maxLength,
	inputMode,
	pattern,
	placeholder,
	id,
	containerClassName,
	labelClassName,
	inputClassName,
	descriptionClassName,
	minHeight,
}: InputGroupProps) {
	if (!id) id = generateRandomId(8)
	const textAreaRef = useRef(null)

	const updateTextAreaHeight = () => {
		if (!textarea || !textAreaRef?.current) return
		const textAreaElement = textAreaRef.current as HTMLTextAreaElement
		textAreaElement.style.height = 'inherit'
		textAreaElement.style.height = textAreaElement.scrollHeight + 2 + 'px'
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		onChange(e.target.value)
		updateTextAreaHeight()
	}

	useEffect(() => {
		updateTextAreaHeight()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={containerClassName}>
			<label htmlFor={id} className={labelClassName}>
				{label}
			</label>

			{description && (
				<p className={descriptionClassName}>{description}</p>
			)}

			{textarea ? (
				<textarea
					value={value}
					onChange={handleChange}
					minLength={minLength}
					maxLength={maxLength}
					inputMode={inputMode}
					placeholder={placeholder || label}
					id={id}
					className={inputClassName}
					style={{ minHeight }}
					ref={textAreaRef}
				/>
			) : (
				<input
					type={inputType}
					value={value}
					onChange={handleChange}
					minLength={minLength}
					maxLength={maxLength}
					inputMode={inputMode}
					pattern={pattern}
					placeholder={placeholder || label}
					id={id}
					className={inputClassName}
				/>
			)}
		</div>
	)
}
