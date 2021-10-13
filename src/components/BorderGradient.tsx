import classNames from 'classnames'

import styles from '@/styles/BorderGradient.module.scss'

interface BorderGradientProps {
	borderWidth?: number
	borderRadius?: number
	className?: string
}

export default function BorderGradient({
	borderWidth,
	borderRadius = 8,
	className,
}: BorderGradientProps) {
	return (
		<svg
			className={classNames(styles.border, className, {
				[styles[`borderWidth${borderWidth}`]]: borderWidth && borderWidth !== 2,
			})}
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<linearGradient
					id="StrokeGradient1"
					x1="3%"
					y1="-1%"
					x2="96%"
					y2="101%"
					gradientUnits="userSpaceOnUse"
				>
					<stop className={styles.strokeStop1} offset="0" />
					<stop className={styles.strokeStop2} offset="1" />
				</linearGradient>
				<linearGradient
					id="FillGradient1"
					x1="3%"
					y1="-1%"
					x2="96%"
					y2="101%"
					gradientUnits="userSpaceOnUse"
				>
					<stop className={styles.fillStop1} offset="0" />
					<stop className={styles.fillStop2} offset="1" />
				</linearGradient>
			</defs>
			<rect
				width="100%"
				height="100%"
				rx={borderRadius}
				ry={borderRadius}
				stroke="url(#StrokeGradient1)"
				fill="url(#FillGradient1)"
			/>
		</svg>
	)
}
