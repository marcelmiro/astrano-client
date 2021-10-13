import Link from 'next/link'
import { useRouter } from 'next/router'

import { Project as IProject } from '@/types'
import { addThousandSeparator } from '@/utils/number'
import SkeletonImage from '@/components/SkeletonImage'

import HeartVector from '@/public/heart.svg'
import styles from '@/styles/ProjectListing.module.scss'

interface ProjectProps extends IProject {}

export default function ProjectListing({
	name,
	slug,
	symbol,
	logoUrl,
	type,
	author,
	tags,
	price,
	likes,
}: ProjectProps) {
	const router = useRouter()
	const projectPageLink = `/p/${slug}`
	const redirectToProjectPage = () => router.push(projectPageLink)
	const formattedPrice = addThousandSeparator(price)

	return (
		<button className={styles.container} onClick={redirectToProjectPage}>
			<SkeletonImage
				src={logoUrl}
				alt={name + ' logo'}
				className={styles.image}
			/>

			<div className={styles.content}>
				<div className={styles.upperRow}>
					<div className={styles.info}>
						<div className={styles.nameContainer}>
							<Link href={projectPageLink}>
								<a className={styles.name}>{name}</a>
							</Link>
							<div className={styles.symbol}>
								<span>{symbol}</span>
							</div>
						</div>
						<p className={styles.author}>{author}</p>
					</div>

					<div className={styles.likes}>
						<HeartVector />
						<span>{likes}</span>
					</div>
				</div>

				<div className={styles.lowerRow}>
					<div className={styles.tags}>
						<div className={styles.tag}>
							{type === 'ico'
								? 'ICO'
								: type === 'live'
								? 'Live'
								: type}
						</div>
						{tags.map((tag, index) => (
							<div className={styles.tag} key={index}>
								{tag}
							</div>
						))}
					</div>

					<p className={styles.price}>
						{formattedPrice ? `$${formattedPrice}` : '-'}
						<small>USD</small>
					</p>
				</div>
			</div>
		</button>
	)
}
