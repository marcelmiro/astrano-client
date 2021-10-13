import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'

import styles from '@/styles/Modal.module.scss'

interface ModalProps {
	show: boolean
	onClose(): void
	children: React.ReactNode
	containerClassName?: string
	onCloseComplete?(): void
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
	containerClassName,
	onCloseComplete,
}: ModalProps) {
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
					onClick={onClose}
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={containerAnimations}
					transition={{ duration: ANIMATION_DURATION }}
				>
					<motion.div
						className={classNames(
							styles.content,
							containerClassName
						)}
						onClick={(e) => e.stopPropagation()}
						variants={contentAnimations}
						transition={{
							duration: ANIMATION_DURATION,
							type: 'spring',
						}}
					>
						<div className={styles.verticalAlign}>
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
