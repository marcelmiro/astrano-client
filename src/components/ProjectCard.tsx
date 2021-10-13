import Link from 'next/link'
import { useRouter } from 'next/router'

import { Project as IProject } from '@/types'
import { addThousandSeparator } from '@/utils/number'
import SkeletonImage from '@/components/SkeletonImage'

import HeartVector from '@/public/heart.svg'
import styles from '@/styles/ProjectCard.module.scss'

interface ProjectProps extends IProject {}

export default function ProjectCard({
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
			<div className={styles.content}>
				<SkeletonImage
					src={logoUrl}
					alt={name + ' logo'}
					className={styles.image}
				/>
				<div className={styles.nameContainer}>
					<Link href={projectPageLink}>
						<a className={styles.name}>{name}</a>
					</Link>
					<div className={styles.symbol}>
						<span>{symbol}</span>
					</div>
				</div>
				<p className={styles.author}>{author}</p>
				<p className={styles.price}>
					{formattedPrice ? `$${formattedPrice}` : '-'}
					<small>USD</small>
				</p>
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
				<div className={styles.likes}>
					<HeartVector />
					<span>{likes}</span>
				</div>
			</div>
		</button>
	)
}
