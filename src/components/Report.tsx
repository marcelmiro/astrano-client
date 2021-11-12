import { useState, useRef } from 'react'
import classNames from 'classnames'

import { reportStatuses, reportMessageMaxLength } from '@/constants'
import Modal from '@/components/Modal'
import LoadingSpinner from '@/components/LoadingSpinner'

import CheckVector from '@/public/check.svg'
import CrossVector from '@/public/cross.svg'
import styles from '@/styles/Report.module.scss'

type Status = typeof reportStatuses[number]

interface ReportProps {
	show: boolean
	onClose(): void
	onSend(message: string): void
	status: Status | null
	onCloseComplete?(): void
}

interface StatusContentProps {
	onClose(): void
}

interface MainContentProps {
	onClose(): void
	onSend(message: string): void
}

interface RenderContentProps {
	isLoading: boolean
	status: Status | null
	onClose(): void
	onSend(message: string): void
}

const LoadingContent = () => (
	<div className={styles.loadingContent}>
		<LoadingSpinner containerClassName={styles.loadingSpinner} />
	</div>
)

const SuccessContent = ({ onClose }: StatusContentProps) => (
	<div className={styles.statusContent}>
		<div className={styles.successIcon}>
			<CheckVector />
		</div>
		<p className={styles.message}>
			We will verify your report as soon as possible. Thanks for
			contributing to the Astrano platform.
		</p>
		<button className={styles.primaryButton} onClick={onClose}>
			Close
		</button>
	</div>
)

const ErrorContent = ({ onClose }: StatusContentProps) => (
	<div className={styles.statusContent}>
		<div className={styles.errorIcon}>
			<CrossVector />
		</div>
		<p className={styles.message}>
			Sorry, an unexpected error has occurred. Please try again later or
			contact support if the error persists.
		</p>
		<button className={styles.primaryButton} onClick={onClose}>
			Close
		</button>
	</div>
)

const MainContent = ({ onClose, onSend }: MainContentProps) => {
	const messageRef = useRef<HTMLTextAreaElement>(null)

	const handleSend = () => {
		const message = messageRef?.current?.value
		if (message) onSend(message)
	}

	return (
		<>
			<h4 className={styles.title}>Report</h4>
			<p className={styles.message}>
				Describe why you think this project should be removed from
				Astrano.
			</p>
			<label className={styles.label} htmlFor="reportMessage">
				Reason
			</label>
			<textarea
				maxLength={reportMessageMaxLength}
				placeholder="Reason to report"
				id="reportMessage"
				className={styles.textarea}
				ref={messageRef}
			/>

			<div className={styles.actions}>
				<button className={styles.button} onClick={onClose}>
					Cancel
				</button>
				<button className={styles.primaryButton} onClick={handleSend}>
					Send
				</button>
			</div>
		</>
	)
}

const RenderContent = ({
	isLoading,
	status,
	onClose,
	onSend,
}: RenderContentProps) => {
	if (isLoading) return <LoadingContent />
	else if (status === 'success') return <SuccessContent onClose={onClose} />
	else if (status === 'error') return <ErrorContent onClose={onClose} />
	else return <MainContent onClose={onClose} onSend={onSend} />
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function Report({
	show,
	onClose,
	onSend,
	status,
	onCloseComplete,
}: ReportProps) {
	const [isLoading, setIsLoading] = useState(false)

	const hasStatus = status && reportStatuses.includes(status)

	const handleSend = async (message: string) => {
		setIsLoading(true)
		await sleep(1000)
		await onSend(message)
		setIsLoading(false)
	}

	return (
		<Modal
			show={show}
			onClose={onClose}
			containerClassName={classNames(styles.container, {
				[styles.statusContainer]: hasStatus,
			})}
			{...(onCloseComplete ? { onCloseComplete } : {})}
		>
			<RenderContent
				isLoading={isLoading}
				status={status}
				onClose={onClose}
				onSend={handleSend}
			/>
		</Modal>
	)
}
