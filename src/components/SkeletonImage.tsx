import { useState, useEffect, useRef } from 'react'
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
	const isMounted = useRef(true)

	useEffect(
		() => () => {
			isMounted.current = false
		},
		[]
	)

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
					onLoadingComplete={() =>
						isMounted.current && setIsLoaded(true)
					}
					onError={() => isMounted.current && setNotFound(true)}
				/>
			)}
		</div>
	)
}
