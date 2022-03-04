import Link from 'next/link'
import { Big } from 'big.js'

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
	logoUri,
	user: { username },
	tags,
	token,
	crowdsale,
	status,
	likes,
	redirectUrl,
	redirect,
}: ProjectProps) {
	let price
	try {
		if (status === 'crowdsale') price = Big(crowdsale.rate).pow(-1)
	} catch (e) {}

	let formattedPrice = '-'
	if (price) {
		const stringifyPrice = price.lt(1) ? price.toFixed(4) : price.toFixed(2)
		formattedPrice = '$' + addThousandSeparator(stringifyPrice)
	}

	return (
		<button className={styles.container} onClick={redirect}>
			<div className={styles.content}>
				<SkeletonImage
					src={logoUri}
					alt={name + ' logo'}
					className={styles.image}
				/>
				<div className={styles.nameContainer}>
					<Link href={redirectUrl}>
						<a className={styles.name}>{name}</a>
					</Link>
					<div className={styles.symbol}>
						<span>{token.symbol}</span>
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
