import classNames from 'classnames'

import styles from '@/styles/Toggle.module.scss'

interface ToggleProps {
	value: boolean
	onChange(): void
}

export default function Toggle({ value, onChange }: ToggleProps) {
	return (
		<div
			className={classNames(styles.container, { [styles.active]: value })}
		>
			<label tabIndex={0}>
				<input
					type="checkbox"
					className={styles.checkbox}
					checked={value}
					onChange={onChange}
				/>
				<div className={styles.background} />
			</label>
		</div>
	)
}
