import Image from 'next/image'
import Link from 'next/link'

import { Token as IToken } from '../types'
import HeartVector from '../../public/heart.svg'
import styles from '../styles/TokenCard.module.scss'

interface TokenCardProps extends IToken {}

export default function TokenCard({
	name,
	ticker,
	logoUrl,
	author,
	tags,
	price,
	likes,
}: TokenCardProps) {
	// Redirect to `/p/${token.name}`
	return (
		<button className={styles.container}>
			<div className={styles.content}>
				<div className={styles.image}>
					<Image
						src={logoUrl}
						alt={name + ' logo'}
						layout="fill"
						objectFit="contain"
					/>
				</div>

				<div className={styles.nameContainer}>
					<p className={styles.name}>{name}</p>
					<div className={styles.ticker}>
						<span>{ticker}</span>
					</div>
				</div>

				<Link href={`/u/${author}`}>
					<a className={styles.author}>{author}</a>
				</Link>

				<p className={styles.price}>
					${price}
					<small>USD</small>
				</p>

				<div className={styles.tags}>
					{tags.map((tag, index) => (
						<span className={styles.tag} key={index}>
							{tag}
						</span>
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
