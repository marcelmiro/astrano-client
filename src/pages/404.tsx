import Link from 'next/link'

import { errorData } from '@/constants'
import Meta from '@/components/Meta'

import styles from '@/styles/error.module.scss'

const { 404: error404 } = errorData

export default function Custom404() {
	return (
		<>
			<Meta title={error404.metaTitle} description={error404.message} />

			<div className={styles.container}>
				<h1 className={styles.title}>Oops!</h1>
				<p
					className={styles.message}
					style={{ maxWidth: error404.messageMaxWidth }}
				>
					{error404.message}
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
