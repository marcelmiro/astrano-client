import { ReactNode } from 'react'

import ErrorMessage from '@/components/ErrorMessage'
import Tooltip from '@/components/Tooltip'

import styles from '@/styles/InputGroup.module.scss'

interface InputGroupProps {
	label: string
	help?: string | React.ReactElement
	id: string
	children: ReactNode
	error?: string
	labelOnClick?(): void
	containerClassName?: string
	labelClassName?: string
	errorClassName?: string
}

export default function InputGroup({
	label,
	help,
	id,
	children,
	error,
	labelOnClick,
	containerClassName,
	labelClassName,
	errorClassName,
}: InputGroupProps) {
	return (
		<div className={containerClassName}>
			<div className={styles.labelContainer}>
				<label
					htmlFor={id}
					className={labelClassName}
					onClick={() => labelOnClick?.()}
				>
					{label}
				</label>
				{help && (
					<Tooltip content={help} interactive>
						<div className={styles.readMore}>?</div>
					</Tooltip>
				)}
			</div>

			{children}

			<ErrorMessage message={error} className={errorClassName} />
		</div>
	)
}
