import Tippy, { TippyProps } from '@tippyjs/react'
import classNames from 'classnames'

import 'tippy.js/dist/tippy.css'
import styles from '@/styles/Tooltip.module.scss'

interface TooltipProps extends TippyProps {
	content: string | HTMLElement
	children: React.ReactElement
	className?: string
}

export default function Tooltip(props: TooltipProps) {
	const { content, children, className, ...restProps } = props

	return (
		<Tippy
			content={content}
			className={classNames(styles.container, className)}
			{...restProps}
		>
			{children}
		</Tippy>
	)
}
