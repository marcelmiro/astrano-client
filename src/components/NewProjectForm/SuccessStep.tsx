import Link from 'next/link'

import CheckVector from '@/public/check.svg'
import styles from '@/styles/FormStep.module.scss'

const TX_BLOCKCHAIN_EXPLORER_BASE_URL = 'https://testnet.bscscan.com/tx/'

export default function SuccessStep({ tx }: { tx?: string }) {
	return (
		<div className={styles.successContainer}>
			<div className={styles.successIcon}>
				<CheckVector />
			</div>

			<p className={styles.text}>
				Congratulations! You have now taken a step to the future and
				successfully deployed your project on the blockchain. Click
				below to find your blockchain transaction or return home to find
				your project in the Astrano platform.
			</p>

			{tx && (
				<p className={styles.text}>
					Your project has been deployed to the blockchain{' '}
					<Link href={TX_BLOCKCHAIN_EXPLORER_BASE_URL + tx}>
						<a target="_blank" rel="noopener noreferrer">
							here
						</a>
					</Link>
				</p>
			)}

			<div className={styles.successActions}>
				<Link href="/">
					<a className={styles.primaryButton}>Return home</a>
				</Link>
			</div>
		</div>
	)
}
