import { useState } from 'react'
import classNames from 'classnames'

import ArrowHead from '@/public/arrowhead.svg'
import styles from '@/styles/Filter.module.scss'

interface FilterProps {
	title: string
	children: React.ReactNode
	className?: string
}

export default function Filter({ title, children, className }: FilterProps) {
	const [open, setOpen] = useState(true)
	const toggleOpen = () => setOpen((open) => !open)

	return (
		<div
			className={classNames(styles.container, className, {
				[styles.open]: open,
			})}
		>
			<button className={styles.button} onClick={toggleOpen}>
				<ArrowHead />
				{title}
			</button>

			{open && <div>{children}</div>}
		</div>
	)
}
