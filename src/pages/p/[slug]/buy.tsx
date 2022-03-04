import {
	Chart,
	ArcElement,
	Tooltip as ChartTooltip,
	Legend,
	ChartData,
	ChartOptions,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import { IProject } from '@/types'
import { pagesMetaData, errorData, chartColors } from '@/constants'
import Error from '@/pages/_error'
import fetch from '@/utils/fetch'
import useCountdown from '@/hooks/useCountdown'

import Meta from '@/components/Meta'
import SkeletonImage from '@/components/SkeletonImage'
import CryptoTrader from '@/components/CryptoTrader'
import Tooltip from '@/components/Tooltip'

import styles from '@/styles/ProjectBuy.module.scss'

Chart.register(ArcElement, ChartTooltip, Legend)

const { projectNotFound } = errorData

interface BuyProjectProps extends IProject {
	errorCode?: number
}

interface ReadMoreProps {
	text: string
}

interface ProgressBarProps {
	progress: number // 0.5 === 50%
}

interface CountdownProps {
	label: string
	startDate: Date | string
	endDate: Date | string
}

interface PieChartLegendProps {
	labels: string[]
	backgroundColor: string[]
}

const pieOptions: ChartOptions<'doughnut'> = {
	cutout: '80%',
	maintainAspectRatio: false,
	responsive: true,
	aspectRatio: 1,
	plugins: { legend: { display: false } },
}

const allocationData: ChartData<'doughnut'> = {
	labels: ['Presale', 'Liquidity Pool', 'Locked'],
	datasets: [
		{
			label: 'Amount of tokens',
			data: [500000, 650000, 850000],
			borderWidth: 0,
			backgroundColor: chartColors,
			hoverBackgroundColor: chartColors,
		},
	],
}

const PieChartLegend = ({ labels, backgroundColor }: PieChartLegendProps) => (
	<div className={styles.legendContainer}>
		{labels.map((label, index) => (
			<div className={styles.legendItem} key={index}>
				<div
					className={styles.legendColor}
					style={{
						backgroundColor:
							backgroundColor[index % backgroundColor.length],
					}}
				/>
				<span className={styles.legendLabel}>{label}</span>
			</div>
		))}
	</div>
)

const ReadMore = ({ text }: ReadMoreProps) => (
	<Tooltip content={text}>
		<div className={styles.readMore}>?</div>
	</Tooltip>
)

const ProgressBar = ({ progress }: ProgressBarProps) => (
	<div className={styles.progressBar}>
		<div
			className={styles.progress}
			style={{ width: progress * 100 + '%' }}
			suppressHydrationWarning
		/>
	</div>
)

const Countdown = ({ label, startDate, endDate }: CountdownProps) => {
	const timeLeft = useCountdown(new Date(endDate))

	const countdownText =
		timeLeft && timeLeft.length > 0
			? timeLeft.map(({ label, value }) => value + label[0]).join(' ')
			: '0d 0h 0m 0s'

	const totalSeconds = +new Date(endDate) - +new Date(startDate)

	const progress =
		totalSeconds > 0
			? Math.min((+new Date() - +new Date(startDate)) / totalSeconds, 1)
			: 1

	return (
		<div>
			<div className={styles.stat}>
				<span className={styles.statName} title={label}>
					Crowdsale ending in
				</span>
				<span className={styles.statValue} suppressHydrationWarning>
					{countdownText}
				</span>
			</div>
			<ProgressBar progress={progress} />
		</div>
	)
}

const PAIR_TOKEN_CONFIG = {
	name: 'USDT',
	symbol: 'USDTT',
	address: '0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684'
}

export default function BuyProject({
	errorCode,
	name,
	logoUri,
	user,
	description,
	token,
	crowdsale: { openingTime, closingTime },
	createdAt,
}: BuyProjectProps) {
	if (errorCode)
		return (
			<Error
				statusCode={errorCode}
				{...(errorCode === 404 ? projectNotFound : {})}
			/>
		)

	const { name: tokenName, symbol: tokenSymbol } = token

	const timeAfterOpen = new Date() >= new Date(openingTime)

	const summary = description.blocks.map(({ text }) => text).join(' ')

	const tokensSoldProgress = 759412 / 2000000

	return (
		<>
			<Meta
				title={pagesMetaData.buyToken.title(
					name,
					tokenName,
					tokenSymbol
				)}
				description={summary}
				image={logoUri}
			/>

			<div className={styles.header}>
				<SkeletonImage
					src={logoUri}
					alt={name + ' logo'}
					className={styles.image}
				/>
				<div className={styles.headerContent}>
					<div className={styles.title}>
						<h1 className={styles.name}>{name}</h1>
						<div className={styles.symbol}>
							<h3 className={styles.symbolText}>{tokenSymbol}</h3>
						</div>
					</div>

					<div className={styles.author}>
						{user?.username ? (
							<>
								{user?.logoUri ? (
									<SkeletonImage
										src={user.logoUri}
										alt={
											(user.username || 'User') + ' icon'
										}
										className={styles.authorImage}
									/>
								) : null}
								<p className={styles.authorName}>
									@{user.username}
								</p>
							</>
						) : (
							<p className={styles.authorName}>user not found</p>
						)}
					</div>
				</div>
			</div>

			<div className={styles.mainContainer}>
				<div className={styles.statsContainer}>
					{timeAfterOpen ? (
						<Countdown
							label="Crowdsale ending in"
							startDate={openingTime}
							endDate={closingTime}
						/>
					) : (
						<Countdown
							label="Crowdsale starting in"
							startDate={createdAt}
							endDate={openingTime}
						/>
					)}

					<div>
						<div className={styles.stat}>
							<span
								className={styles.statName}
								title="Tokens sold"
							>
								Tokens sold
							</span>
							<span className={styles.statValue}>
								759,412 / 2,000,000 {tokenSymbol}
							</span>
						</div>
						<ProgressBar progress={tokensSoldProgress} />
					</div>

					<div className={styles.stat}>
						<span className={styles.statName} title="Price">
							Price
						</span>
						<span className={styles.statValue}>
							1 {PAIR_TOKEN_CONFIG.symbol} = 1,250 {tokenSymbol}
						</span>
					</div>

					{/* <div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Soft cap">Soft cap</span>
							<ReadMore text="The minimum amount of funds needed for the project to start." />
						</div>
						<span className={styles.statValue}>1,000,000 {tokenSymbol}</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Hard cap">Hard cap</span>
							<ReadMore text="The maximum amount of funds that the project is looking to raise." />
						</div>
						<span className={styles.statValue}>2,000,000 {tokenSymbol}</span>
					</div> */}

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Minimum purchase amount">
								Minimum purchase amount
							</span>
							<ReadMore text="The minimum amount of tokens you can buy." />
						</div>
						<span className={styles.statValue}>
							5 {PAIR_TOKEN_CONFIG.symbol}
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Maximum purchase amount">
								Maximum purchase amount
							</span>
							<ReadMore text="The maximum amount of tokens you can buy." />
						</div>
						<span className={styles.statValue}>
							1,000 {tokenSymbol}
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Percentage to Liquidity Pool">
								Percentage to LP
							</span>
							<ReadMore text="The amount of tokens that will be used to start the Liquidity Pool (LP) in the Automated Market Maker (AMM). Left over tokens will be transferred automatically to the project creator's wallet." />
						</div>
						<span className={styles.statValue}>70%</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Liquidity lockup time">
								Liquidity lockup time
							</span>
							<ReadMore text="The amount of time that needs to pass before the project creator can remove the initial Liquidity Pool's funds" />
						</div>
						<Tooltip content="Mon Dec 26 2022 20:49:09 GMT+0100 (Central European Standard Time)">
							<span className={styles.statValue}>1 year</span>
						</Tooltip>
					</div>

					<div className={styles.allocation}>
						<h2 className={styles.allocationTitle}>
							Token allocation
						</h2>
						<div className={styles.allocationChartContainer}>
							<div className={styles.allocationChart}>
								<Doughnut
									data={allocationData}
									options={pieOptions}
								/>
							</div>

							<div className={styles.allocationChartSpacing} />

							<PieChartLegend
								labels={allocationData.labels as string[]}
								backgroundColor={
									allocationData.datasets[0]
										.backgroundColor as string[]
								}
							/>
						</div>
					</div>
				</div>

				<div className={styles.traderContainer}>
					<CryptoTrader
						name={tokenName}
						symbol={tokenSymbol}
						logoUri={logoUri}
					/>
					<p className={styles.traderDisclaimer}>
						<b>DISCLAIMER</b> Astrano recommends its users to
						perform their own research before investing in any
						project (both in the Astrano platform and outside of
						it).
					</p>
				</div>
			</div>
		</>
	)
}

const AMM_BASE_URL =
	'https://pancake.kiemtienonline360.com/#/swap?outputCurrency='

export async function getServerSideProps({
	params,
}: {
	params: { slug: string }
}) {
	const { slug } = params
	const { data: project, error } = await fetch<IProject>('/projects/' + slug)

	if (error || !project) {
		const errorCode = error?.status || 500
		return { props: { errorCode } }
	}

	const status = project.status?.toLowerCase()
	if (status === 'live')
		return {
			redirect: {
				permanent: false,
				destination: AMM_BASE_URL + project.token.tokenAddress,
			},
		}
	if (status === 'crowdsale') return { props: project }

	return { props: { errorCode: 404 } }
}
