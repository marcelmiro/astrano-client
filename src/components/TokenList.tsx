import Image from 'next/image'
import Link from 'next/link'

import { Token as IToken } from '../types'
import HeartVector from '../../public/heart.svg'
import styles from '../styles/TokenList.module.scss'

interface TokenListProps extends IToken {}

export default function TokenList({
	name,
	ticker,
	logoUrl,
	author,
	tags,
	price,
	likes,
}: TokenListProps) {
	return (
		<button className={styles.container}>
			<div className={styles.image}>
				<Image
					src={logoUrl}
					alt={name + ' logo'}
					layout="fill"
					objectFit="contain"
				/>
			</div>
			<div className={styles.content}>
				<div className={styles.upperRow}>
					<div className={styles.info}>
						<div className={styles.nameContainer}>
							<p className={styles.name}>{name}</p>
							<div className={styles.ticker}>
								<span>{ticker}</span>
							</div>
						</div>
						<Link href={`/u/${author}`}>
							<a className={styles.author}>{author}</a>
						</Link>
					</div>
					<div className={styles.likes}>
						<HeartVector />
						<span>{likes}</span>
					</div>
				</div>
				<div className={styles.lowerRow}>
					<div className={styles.tags}>
						{tags.map((tag, index) => (
							<span className={styles.tag} key={index}>
								{tag}
							</span>
						))}
					</div>
					<p className={styles.price}>
						${price}
						<small>USD</small>
					</p>
				</div>
			</div>
		</button>
	)
}
