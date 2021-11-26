import Link from 'next/link'

import { IProject } from '@/types'
import { addThousandSeparator } from '@/utils/number'
import SkeletonImage from '@/components/SkeletonImage'

import HeartVector from '@/public/heart.svg'
import styles from '@/styles/ProjectCard.module.scss'

interface ProjectProps extends IProject {
	redirectUrl: string
	redirect(): void
}

export default function ProjectCard({
	name,
	logoUrl,
	user: { username },
	tags,
	token: { symbol, price },
	status: { name: status },
	likes,
	redirectUrl,
	redirect,
}: ProjectProps) {
	const _formattedPrice = addThousandSeparator(price)
	const formattedPrice = _formattedPrice ? '$' + _formattedPrice : '-'

	return (
		<button className={styles.container} onClick={redirect}>
			<div className={styles.content}>
				<SkeletonImage
					src={logoUrl}
					alt={name + ' logo'}
					className={styles.image}
				/>
				<div className={styles.nameContainer}>
					<Link href={redirectUrl}>
						<a className={styles.name}>{name}</a>
					</Link>
					<div className={styles.symbol}>
						<span>{symbol}</span>
					</div>
				</div>

				<p className={styles.author}>
					{username ? '@' + username : 'user not found'}
				</p>

				<p
					className={styles.price}
					title={formattedPrice.length > 16 ? formattedPrice : ''}
				>
					{formattedPrice}
					<small>USD</small>
				</p>

				<div className={styles.tags}>
					<div className={styles.tag}>{status}</div>
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
