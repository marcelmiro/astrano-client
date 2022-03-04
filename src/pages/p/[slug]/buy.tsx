import { useState, useEffect, useCallback } from 'react'
import {
	Chart,
	ArcElement,
	Tooltip as ChartTooltip,
	Legend,
	ChartData,
	ChartOptions,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Big } from 'big.js'
import { ethers } from 'ethers'

import { IProject } from '@/types'
import {
	pagesMetaData,
	errorData,
	chartColors,
	PAIR_TOKEN_CONFIG,
} from '@/constants'
import Error from '@/pages/_error'
import fetch from '@/utils/fetch'
import useCountdown from '@/hooks/useCountdown'
import { addThousandSeparator } from '@/utils/number'
import useMetamask, { MetamaskStatus } from '@/hooks/useMetamask'
import useRpc from '@/hooks/useRpc'
import { abi as crowdsaleAbi } from '@/contracts/Crowdsale'

import Meta from '@/components/Meta'
import SkeletonImage from '@/components/SkeletonImage'
import CrowdsaleTrader from '@/components/CrowdsaleTrader'
import Tooltip from '@/components/Tooltip'
import Skeleton from '@/components/Skeleton'

import styles from '@/styles/ProjectBuy.module.scss'

Chart.register(ArcElement, ChartTooltip, Legend)

const { projectNotFound } = errorData

interface BuyProjectProps extends IProject {
	errorCode?: number
}

interface ReadMoreProps {
	content: string | React.ReactElement
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
	percentages: string[]
}

const pieOptions: ChartOptions<'doughnut'> = {
	cutout: '80%',
	maintainAspectRatio: false,
	responsive: true,
	aspectRatio: 1,
	plugins: { legend: { display: false } },
}

const PieChartLegend = ({
	labels,
	backgroundColor,
	percentages,
}: PieChartLegendProps) => (
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
				<span className={styles.legendLabel}>
					{label} ({percentages[index]}%)
				</span>
			</div>
		))}
	</div>
)

const ReadMore = ({ content }: ReadMoreProps) => (
	<Tooltip content={content}>
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
					{label}
				</span>
				<Tooltip content={new Date(endDate).toString()}>
					<span className={styles.statValue} suppressHydrationWarning>
						{countdownText}
					</span>
				</Tooltip>
			</div>
			<ProgressBar progress={progress} />
		</div>
	)
}

export default function BuyProject({
	errorCode,
	name,
	logoUri,
	user,
	description,
	token,
	crowdsale,
	liquidity,
	createdAt,
}: BuyProjectProps) {
	const [tokensSold, setTokensSold] = useState('')
	const [isOpen, setIsOpen] = useState<boolean>()

	const { provider: metamaskProvider, status } = useMetamask()
	const { provider: rpcProvider } = useRpc()

	const updateTokensSold = useCallback(async () => {
		const provider =
			metamaskProvider && status === MetamaskStatus.CONNECTED
				? metamaskProvider
				: rpcProvider

		if (!provider) return

		const Crowdsale = new ethers.Contract(
			crowdsale.crowdsaleAddress,
			crowdsaleAbi,
			provider
		)
		const [isOpen, tokensSold] = await Promise.all([
			Crowdsale.isOpen(),
			Crowdsale.tokensSold(),
		])
		setIsOpen(isOpen)
		setTokensSold(ethers.utils.formatEther(tokensSold))
	}, [metamaskProvider, status, rpcProvider, crowdsale.crowdsaleAddress])

	useEffect(() => {
		updateTokensSold()
	}, [updateTokensSold])

	if (errorCode)
		return (
			<Error
				statusCode={errorCode}
				{...(errorCode === 404 ? projectNotFound : {})}
			/>
		)

	const {
		name: tokenName,
		symbol: tokenSymbol,
		totalSupply,
		lockStartIn: tokenLockStartIn,
		lockDuration: tokenLockDuration,
	} = token

	const {
		rate,
		cap,
		goal,
		individualCap,
		minPurchaseAmount,
		openingTime,
		closingTime,
	} = crowdsale

	const {
		percentage: liquidityPercentage,
		rate: liquidityRate,
		lockStartIn: liquidityLockStartIn,
		lockDuration: liquidityLockDuration,
	} = liquidity

	const timeAfterOpen = new Date() >= new Date(openingTime)

	const summary = description.blocks.map(({ text }) => text).join(' ')

	const tokensSoldProgress = tokensSold
		? Big(tokensSold).div(cap).toNumber()
		: 0

	const minTokenAmount = Big(minPurchaseAmount).mul(rate).toString()

	const capAmount = Big(cap)
	const liquidityAmount = Big(
		capAmount
			.div(rate)
			.mul(liquidityPercentage)
			.div(100)
			.toFixed(0, Big.roundDown)
	).mul(liquidityRate)
	const lockedAmount = Big(totalSupply).sub(capAmount.add(liquidityAmount))

	const allocationData: ChartData<'doughnut'> = {
		labels: ['Presale', 'Liquidity Pool', 'Locked'],
		datasets: [
			{
				label: 'Amount of tokens',
				data: [
					capAmount.toNumber(),
					liquidityAmount.toNumber(),
					lockedAmount.toNumber(),
				],
				borderWidth: 0,
				backgroundColor: chartColors,
				hoverBackgroundColor: chartColors,
			},
		],
	}

	const allocationPercentages = [
		capAmount.mul(100).div(totalSupply).toFixed(0, Big.roundDown),
		liquidityAmount.mul(100).div(totalSupply).toFixed(0, Big.roundDown),
		lockedAmount.mul(100).div(totalSupply).toFixed(0, Big.roundDown),
	]

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
					{isOpen && (
						<Countdown
							label="Crowdsale ending in"
							startDate={openingTime}
							endDate={closingTime}
						/>
					)}

					{!isOpen && !timeAfterOpen && (
						<Countdown
							label="Crowdsale starting in"
							startDate={createdAt}
							endDate={openingTime}
						/>
					)}

					{isOpen === false && timeAfterOpen && (
						<div className={styles.stat}>
							<span className={styles.statName} title="Status">
								Status
							</span>
							<span className={styles.statValue}>Closed</span>
						</div>
					)}

					{isOpen && (
						<div>
							<div className={styles.stat}>
								<span
									className={styles.statName}
									title="Tokens sold"
								>
									Tokens sold
								</span>
								<span className={styles.statValue}>
									{tokensSold || (
										<Skeleton
											className={styles.skeletonStatValue}
										/>
									)}{' '}
									/ {addThousandSeparator(cap)} {tokenSymbol}
								</span>
							</div>
							<ProgressBar progress={tokensSoldProgress} />
						</div>
					)}

					<div className={styles.stat}>
						<span className={styles.statName} title="Price">
							Price
						</span>
						<span className={styles.statValue}>
							1 {PAIR_TOKEN_CONFIG.symbol} = {rate} {tokenSymbol}
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Cap">Cap</span>
							<ReadMore content="The maximum amount of tokens allowed to sell by the crowdsale. After reaching this amount, the crowdsale will close." />
						</div>
						<span className={styles.statValue}>
							{addThousandSeparator(cap)} {tokenSymbol}
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Goal">Goal</span>
							<ReadMore content="The minimum amount of tokens that are required to be sold for the crowdsale to be considered successful. If the crowdsale succeeds, the project creator will be able to finalize the project and generate the liquidity to enter the live market. If the crowdsale fails, investors will be able to request refunds of the tokens they purchased." />
						</div>
						<span className={styles.statValue}>
							{addThousandSeparator(goal)} {tokenSymbol}
						</span>
					</div>

					{minTokenAmount && minTokenAmount !== '0' && (
						<div className={styles.stat}>
							<div className={styles.statName}>
								<span title="Minimum purchase amount">
									Minimum purchase amount
								</span>
								<ReadMore content="The minimum amount of tokens you can buy." />
							</div>
							<span className={styles.statValue}>
								{addThousandSeparator(minTokenAmount)}{' '}
								{tokenSymbol}
							</span>
						</div>
					)}

					{individualCap && individualCap !== '0' && (
						<div className={styles.stat}>
							<div className={styles.statName}>
								<span title="Maximum purchase amount">
									Maximum purchase amount
								</span>
								<ReadMore content="The maximum amount of tokens you can buy." />
							</div>
							<span className={styles.statValue}>
								{addThousandSeparator(individualCap)}{' '}
								{tokenSymbol}
							</span>
						</div>
					)}

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Percentage to liquidity">
								Percentage to liquidity
							</span>
							<ReadMore content="The amount of tokens that will be used to start the liquidity pool in the live market. Left over tokens will be transferred automatically to the project creator's wallet." />
						</div>
						<span className={styles.statValue}>
							{liquidityPercentage}%
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Token vesting start (days)">
								Token vesting start (days)
							</span>
							<ReadMore
								content={
									<span>
										Vesting start is the amount of time
										elapsed before releasing any tokens.
										<br />
										<br />
										To prevent rug pulls (learn about rug
										pulls in
										<a
											href="https://docs.astrano.io/"
											target="_blank"
											rel="noopener noreferrer"
										>
											docs.astrano.io
										</a>
										), Astrano forces project creators to
										vest their unused tokens. Token vesting
										refers to the locking of tokens in a
										smart contract and releasing an
										incremental amount of the locked tokens
										proportional to the current time. This
										prevents project creators to overflood
										the token&apos;s market or abuse
										investors that purchase their token.
									</span>
								}
							/>
						</div>
						<span className={styles.statValue}>
							{addThousandSeparator(tokenLockStartIn)} days
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Token vesting duration (days)">
								Token vesting duration (days)
							</span>
							<ReadMore
								content={
									<span>
										Vesting duration is the number of days
										(starting from the vesting start time)
										until the full amount of locked tokens
										are released.
										<br />
										<br />
										To prevent rug pulls (learn about rug
										pulls in
										<a
											href="https://docs.astrano.io/"
											target="_blank"
											rel="noopener noreferrer"
										>
											docs.astrano.io
										</a>
										), Astrano forces project creators to
										vest their unused tokens. Token vesting
										refers to the locking of tokens in a
										smart contract and releasing an
										incremental amount of the locked tokens
										proportional to the current time. This
										prevents project creators to overflood
										the token&apos;s market or abuse
										investors that purchase their token.
									</span>
								}
							/>
						</div>
						<span className={styles.statValue}>
							{addThousandSeparator(tokenLockDuration)} days
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Liquidity vesting start (days)">
								Liquidity vesting start (days)
							</span>
							<ReadMore
								content={
									<span>
										Vesting start is the amount of time
										elapsed before releasing any liquidity
										tokens. When supplying liquidity for a
										liquidity pool, an amount of generated
										tokens is given to the supplier as a
										means to quantify your contribution and
										be able to extract your liquidity from
										the liquidity pool.
										<br />
										<br />
										To prevent rug pulls (learn about rug
										pulls in
										<a
											href="https://docs.astrano.io/"
											target="_blank"
											rel="noopener noreferrer"
										>
											docs.astrano.io
										</a>
										), Astrano forces project creators to
										vest liquidity tokens. Token vesting
										refers to the locking of tokens in a
										smart contract and releasing an
										incremental amount of the locked tokens
										proportional to the current time. This
										prevents project creators to overflood
										the token&apos;s market or abuse
										investors that purchase their token.
									</span>
								}
							/>
						</div>
						<span className={styles.statValue}>
							{addThousandSeparator(liquidityLockStartIn)} days
						</span>
					</div>

					<div className={styles.stat}>
						<div className={styles.statName}>
							<span title="Liquidity vesting duration (days)">
								Liquidity vesting duration (days)
							</span>
							<ReadMore
								content={
									<span>
										Vesting duration is the number of days
										(starting from the Vesting start time)
										until the full amount of locked tokens
										are released. When supplying liquidity
										for a liquidity pool, an amount of
										generated tokens is given to the
										supplier as a means to quantify your
										contribution and be able to extract your
										liquidity from the liquidity pool.
										<br />
										<br />
										To prevent rug pulls (learn about rug
										pulls in
										<a
											href="https://docs.astrano.io/"
											target="_blank"
											rel="noopener noreferrer"
										>
											docs.astrano.io
										</a>
										), Astrano forces project creators to
										vest their unused tokens. Token vesting
										refers to the locking of tokens in a
										smart contract and releasing an
										incremental amount of the locked tokens
										proportional to the current time. This
										prevents project creators to overflood
										the token&apos;s market or abuse
										investors that purchase their token.
									</span>
								}
							/>
						</div>
						<span className={styles.statValue}>
							{addThousandSeparator(liquidityLockDuration)} days
						</span>
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
								percentages={allocationPercentages}
							/>
						</div>
					</div>
				</div>

				<div className={styles.traderContainer}>
					<CrowdsaleTrader
						logoUri={logoUri}
						token={token}
						crowdsale={crowdsale}
						isOpen={isOpen}
						updateTokensSold={updateTokensSold}
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
