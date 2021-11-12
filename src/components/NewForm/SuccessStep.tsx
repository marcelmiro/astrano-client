import Link from 'next/link'

import CheckVector from '@/public/check.svg'
import styles from '@/styles/FormStep.module.scss'

export default function SuccessStep() {
	return (
		<div className={styles.successContainer}>
			<div className={styles.successIcon}>
				<CheckVector />
			</div>

			<p className={styles.successText}>
				Congratulations! We will verify your project to be uploaded to
				the Astrano platform as soon as possible.
			</p>

			<div className={styles.successActions}>
				<Link href="/">
					<a className={styles.primaryButton}>Return home</a>
				</Link>
			</div>
		</div>
	)
}
