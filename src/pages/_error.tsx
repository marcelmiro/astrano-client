import { NextPageContext } from 'next'
import Link from 'next/link'

import { errorData } from '@/constants'
import Meta from '@/components/Meta'
import Navbar from '@/components/Navbar'

import styles from '@/styles/error.module.scss'

interface ErrorProps {
	statusCode: number
	metaTitle?: string
	message?: string
	messageMaxWidth?: string
}

function Error({
	statusCode,
	metaTitle,
	message,
	messageMaxWidth,
}: ErrorProps) {
	const errorDatum = errorData[statusCode] || errorData.default
	if (message) errorDatum.message = message
	if (messageMaxWidth) errorDatum.messageMaxWidth = messageMaxWidth
	if (metaTitle) errorDatum.metaTitle = metaTitle

	return (
		<>
			<Meta title={errorDatum.metaTitle} description={errorDatum.message}>
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap"
					rel="stylesheet"
				/>
			</Meta>

			<Navbar />

			<div className={styles.container}>
				<h1 className={styles.title}>Oops!</h1>
				<p
					className={styles.message}
					style={{ maxWidth: errorDatum.messageMaxWidth }}
				>
					{errorDatum.message}
				</p>
				<div className={styles.actions}>
					<Link href="/">
						<a className={styles.primaryButton}>Return home</a>
					</Link>
					<Link href="mailto:support@astrano.io">
						<a className={styles.button}>Report a problem</a>
					</Link>
				</div>
			</div>
		</>
	)
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404
	return { statusCode }
}

export default Error
