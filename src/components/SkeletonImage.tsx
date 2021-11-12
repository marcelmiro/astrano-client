import React, { useState } from 'react'
import Image from 'next/image'
import classNames from 'classnames'

import styles from '@/styles/Skeleton.module.scss'

type ObjectFit = 'contain' | 'cover'

interface SkeletonImageProps {
	src: string
	alt: string
	objectFit?: ObjectFit
	className?: string
}

export default function SkeletonImage({
	src,
	alt,
	objectFit = 'contain',
	className,
}: SkeletonImageProps) {
	const [isLoaded, setIsLoaded] = useState(false)

	return (
		<div className={classNames(styles.container, className)}>
			{!isLoaded && <div className={styles.placeholder} />}
			<Image
				src={src}
				alt={alt}
				layout="fill"
				objectFit={objectFit}
				onLoad={() => setIsLoaded(true)}
			/>
		</div>
	)
}
