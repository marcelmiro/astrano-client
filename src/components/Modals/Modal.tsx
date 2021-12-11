import { useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'

import styles from '@/styles/Modals/Modal.module.scss'

interface ModalProps {
	show: boolean
	onClose(): void
	children: React.ReactNode
	className?: string
	onCloseComplete?(): void
	centered?: boolean
}

const ANIMATION_DURATION = 0.1
const containerAnimations = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
}
const contentAnimations = {
	hidden: {
		scale: 0.8,
		y: 32,
	},
	visible: {
		scale: 1,
		y: 0,
	},
}

export default function Modal({
	show,
	onClose,
	children,
	className,
	onCloseComplete,
	centered = true,
}: ModalProps) {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const handleClose = useCallback(
		(e?: any) => {
			e?.preventDefault()
			e?.stopPropagation()
			onClose()
		},
		[onClose]
	)

	useEffect(() => {
		const close = (e: KeyboardEvent) => {
			if (e.key === 'Escape') handleClose(e)
		}
		window.addEventListener('keydown', close)
		return () => window.removeEventListener('keydown', close)
	}, [handleClose])

	return (
		<AnimatePresence
			exitBeforeEnter
			{...(onCloseComplete ? { onExitComplete: onCloseComplete } : {})}
		>
			{show && (
				<motion.div
					className={classNames(styles.container, {
						[styles.open]: show,
					})}
					onMouseDown={handleClose}
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={containerAnimations}
					transition={{ duration: ANIMATION_DURATION }}
				>
					<motion.div
						className={classNames(styles.content, className)}
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
						variants={contentAnimations}
						transition={{
							duration: ANIMATION_DURATION,
							type: 'spring',
						}}
					>
						<div
							className={
								centered
									? styles.verticalAlign
									: styles.fullWidth
							}
						>
							<div className={styles.horizontalAlign}>
								<div className={styles.innerContent}>
									{children}
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
