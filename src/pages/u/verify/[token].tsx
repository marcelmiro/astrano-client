import Link from 'next/link'

import { pagesMetaData } from '@/constants'
import Meta from '@/components/Meta'
import fetch from '@/utils/fetch'

import styles from '@/styles/UserVerification.module.scss'

const { verifyUser: metaDatum } = pagesMetaData

export default function VerifyUser() {
	return (
		<>
			<Meta title={metaDatum.title} hideSeo />

			<div className={styles.container}>
				<h1 className={styles.title}>Incorrect or expired link</h1>

				<p className={styles.message}>
					Sorry, this verification URL is incorrect or has already
					expired. To generate a new verification URL, register again.
				</p>

				<div className={styles.actions}>
					<Link href="/">
						<a className={styles.primaryButton}>Return home</a>
					</Link>
				</div>
			</div>
		</>
	)
}

export async function getServerSideProps({
	params,
}: {
	params: { token: string }
}) {
	const token = params.token

	const { data, error } = await fetch('/auth/verify/' + token)

	if (error && error.status !== 404) {
		const errorCode = error.status || 500
		return { props: { errorCode } }
	}

	if (data)
		return {
			redirect: { permanent: false, destination: '/?verified' },
			props: {
				modal: {
					status: 'success',
					message: 'Your account is not verified',
				},
			},
		}

	return { props: {} }
}
