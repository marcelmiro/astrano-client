import classNames from 'classnames'

import styles from '@/styles/Skeleton.module.scss'

interface SkeletonProps {
	className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
	return (
		<div className={classNames(styles.container, className)}>
			<div className={styles.placeholder} />
		</div>
	)
}
