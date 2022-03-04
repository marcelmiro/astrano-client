import SkeletonImage from '@/components/SkeletonImage'

import ArrowVector from '@/public/arrow.svg'
import styles from '@/styles/CryptoTrader.module.scss'

interface CryptoTraderProps {
	name: string
	symbol: string
	logoUri: string
}

export default function CryptoTrader({
	name,
	symbol,
	logoUri,
}: CryptoTraderProps) {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3 className={styles.title}>Buy {name}</h3>
				<p className={styles.description}>
					Learn how to buy <b>{symbol}</b> by clicking{' '}
					<a
						href="https://docs.astrano.io/"
						target="_blank"
						rel="noopener noreferrer"
					>
						here
					</a>
				</p>
			</div>

			<div className={styles.content}>
				<div className={styles.swap}>
					<div className={styles.swapOverview}>
						<div className={styles.token}>
							<SkeletonImage
								src="https://cdn.astrano.io/k7ntfd6duheh4awu5vwkt3av67sa8nr3.svg"
								alt="USDT logo"
								className={styles.tokenLogo}
							/>
							<span className={styles.tokenName}>USDT</span>
						</div>

						<button className={styles.maxBalance} title="Choose maximum amount">
							MAX
						</button>
					</div>

					<label title="USDT amount">
						<input
							type="text"
							inputMode="decimal"
							className={styles.swapInput}
							title="USDT amount"
							placeholder="0.0"
						/>
					</label>
				</div>

				<div className={styles.swapArrow}>
					<ArrowVector />
				</div>

				<div className={styles.swap}>
					<div className={styles.swapOverview}>
						<div className={styles.token}>
							<SkeletonImage
								src={logoUri}
								alt={symbol + ' logo'}
								className={styles.tokenLogo}
							/>
							<span className={styles.tokenName}>{symbol}</span>
						</div>
					</div>

					<label title={symbol + ' amount'}>
						<div className={styles.swapInput} title={symbol + ' amount'}>
							<span>0.0</span>
						</div>
					</label>
				</div>

				<button className={styles.button}>Buy</button>
			</div>
		</div>
	)
}
