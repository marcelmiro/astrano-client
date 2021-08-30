import { useState } from 'react'
import classNames from 'classnames'

import ArrowHead from '../../public/arrowhead.svg'
import styles from '../styles/Filter.module.scss'

interface RadioProps {
	title: string
	className?: string
}

export default function Radio({ title, className }: RadioProps) {
	const [open, setOpen] = useState(true)
	const toggleOpen = () => setOpen(open => !open)

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
			{open && <div className={styles.content}>content</div>}
		</div>
	)
}
