import { ReactNode } from 'react'

import ErrorMessage from '@/components/ErrorMessage'

interface InputGroupProps {
	label: string
	description?: string
	id: string
	children: ReactNode
	error?: string
	labelOnClick?(): void
	containerClassName?: string
	labelClassName?: string
	descriptionClassName?: string
	errorClassName?: string
}

export default function InputGroup({
	label,
	description,
	id,
	children,
	error,
	labelOnClick,
	containerClassName,
	labelClassName,
	descriptionClassName,
	errorClassName,
}: InputGroupProps) {
	return (
		<div className={containerClassName}>
			<label
				htmlFor={id}
				className={labelClassName}
				onClick={() => labelOnClick?.()}
			>
				{label}
			</label>

			{description && (
				<p className={descriptionClassName}>{description}</p>
			)}

			{children}

			<ErrorMessage message={error} className={errorClassName} />
		</div>
	)
}
