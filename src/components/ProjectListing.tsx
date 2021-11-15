import Link from 'next/link'
import { useRouter } from 'next/router'

import { IProject } from '@/types'
import { addThousandSeparator } from '@/utils/number'
import SkeletonImage from '@/components/SkeletonImage'
import Skeleton from './Skeleton'

import HeartVector from '@/public/heart.svg'
import styles from '@/styles/ProjectListing.module.scss'

interface ProjectProps extends IProject {}

export default function ProjectListing({
	name,
	slug,
	logoUri,
	user: { username },
	tags,
	token: { symbol, price },
	status: { name: status },
	likes,
}: ProjectProps) {
	const router = useRouter()
	const projectPageLink = `/p/${slug}`
	const redirectToProjectPage = () => router.push(projectPageLink)
	const _formattedPrice = addThousandSeparator(price)
	const formattedPrice = _formattedPrice ? '$' + _formattedPrice : '-'

	return (
		<button className={styles.container} onClick={redirectToProjectPage}>
			<SkeletonImage
				src={logoUri}
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
						<p className={styles.author}>
							{username ? '@' + username : 'user not found'}
						</p>
					</div>

					<div className={styles.likes}>
						<HeartVector />
						<span>{likes}</span>
					</div>
				</div>

				<div className={styles.lowerRow}>
					<div className={styles.tags}>
						<div className={styles.tag}>{status}</div>
						{tags.map((tag, index) => (
							<div className={styles.tag} key={index}>
								{tag}
							</div>
						))}
					</div>

					<p
						className={styles.price}
						title={formattedPrice.length > 16 ? formattedPrice : ''}
					>
						{formattedPrice}
						<small>USD</small>
					</p>
				</div>
			</div>
		</button>
	)
}
