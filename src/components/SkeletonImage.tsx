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
	objectFit = 'cover',
	className,
}: SkeletonImageProps) {
	const [isLoaded, setIsLoaded] = useState(false)
	const [notFound, setNotFound] = useState(false)

	return (
		<div className={classNames(styles.container, className)}>
			{(!isLoaded || notFound) && (
				<div
					className={classNames(styles.placeholder, {
						[styles.noAnimation]: notFound,
					})}
				/>
			)}

			{!notFound && (
				<Image
					src={src}
					alt={alt}
					layout="fill"
					objectFit={objectFit}
					onLoadingComplete={() => setIsLoaded(true)}
					onError={() => setNotFound(true)}
				/>
			)}
		</div>
	)
}
