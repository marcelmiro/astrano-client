import { useState, useEffect } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import Big from 'big.js'
import { AxiosRequestHeaders } from 'axios'

import {
	pagesMetaData,
	errorData,
	contractAddressLastCharactersLength,
	reportStatuses,
} from '@/constants'
import { IProject } from '@/types'
import { addThousandSeparator } from '@/utils/number'
// import { copyToClipboard } from '@/utils/element'
import fetch from '@/utils/fetch'
import { useAuth } from '@/context/Auth.context'
// import useCountdown from '@/hooks/useCountdown'

import Error from '@/pages/_error'
import Meta from '@/components/Meta'
import SkeletonImage from '@/components/SkeletonImage'
import ViewEditor from '@/components/ViewEditor'
import Report from '@/components/Modals/Report'
import LoadingSpinner from '@/components/LoadingSpinner'

import HeartVector from '@/public/heart-filled.svg'
import FlagVector from '@/public/flag.svg'
// import CopyVector from '@/public/copy.svg'
import LinkVector from '@/public/link.svg'
// import MetamaskVector from '@/public/metamask.svg'
import styles from '@/styles/Project.module.scss'
import { useMixpanel } from '@/context/Mixpanel'

const { projectNotFound } = errorData

type ReportStatus = typeof reportStatuses[number]

interface ProjectProps extends IProject {
	errorCode?: number
}

/* interface CountdownProps {
	status: string
	date: Date
	placeholder: string
} */

const TOKEN_BLOCKCHAIN_EXPLORER_BASE_URL = 'https://testnet.bscscan.com/token/'

const ADDR_BLOCKCHAIN_EXPLORER_BASE_URL = 'https://testnet.bscscan.com/address/'

/* const getDomainFromUrl = (url: string): string | undefined => {
	if (!url || typeof url !== 'string') return
	try {
		const urlObject = new URL(url)
		const hostname = urlObject?.hostname
		if (!hostname) return
		return hostname.startsWith('www.') ? hostname.slice(4) : hostname
	} catch (e) {
		return
	}
} */

/* const Countdown = ({ status, date, placeholder }: CountdownProps) => {
	const timeLeft = useCountdown(date)

	if (!timeLeft) return null

	return (
		<div className={styles.datum}>
			<h6 className={styles.datumTitle}>
				{status} {placeholder}
			</h6>
			<div className={styles.datumCountdown}>
				{timeLeft.map((interval, index) => (
					<p
						className={styles.countdownTime}
						suppressHydrationWarning
						key={index}
					>
						{interval.value || 0}
						<small>{interval.label}</small>
					</p>
				))}
			</div>
		</div>
	)
} */

const DescriptionNotFound = ({ className }: { className?: string }) => (
	<p className={classNames(styles.descriptionNotFound, className)}>
		Project description not found
	</p>
)

const SidebarContract = ({
	label,
	address,
	explorerUrl,
}: {
	label: string
	address: string
	explorerUrl: string
}) => {
	const splitAddress = [
		address.slice(0, address.length - contractAddressLastCharactersLength),
		address.slice(
			address.length - contractAddressLastCharactersLength,
			address.length
		),
	]
	return (
		<div className={styles.sidebarDetail}>
			<p className={styles.sidebarTitle}>{label}</p>
			<div
				className={classNames(
					styles.sidebarText,
					styles.contractAddress
				)}
			>
				<span className={styles.contractAddressStart}>
					{splitAddress[0]}
				</span>
				<span className={styles.contractAddressEnd}>
					{splitAddress[1]}
				</span>
				<Link href={explorerUrl}>
					<a
						className={classNames(
							styles.sidebarIconButton,
							styles.linkIcon
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<LinkVector />
					</a>
				</Link>
			</div>
		</div>
	)
}

export default function Project({
	errorCode,
	_id: id,
	name,
	slug,
	logoUri,
	user,
	tags,
	description,
	token,
	crowdsale,
	status,
	// website,
	// socialUrls,
	likes: _likes,
}: ProjectProps) {
	const { track } = useMixpanel()
	const {
		user: contextUser,
		setUser: setContextUser,
		logOut: contextLogOut,
		setShowAuthModal,
	} = useAuth()
	const [showReportModal, setShowReportModal] = useState(false)
	const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null)
	const [likes, setLikes] = useState(_likes)
	const [isLikeLoading, setIsLikeLoading] = useState(false)
	const [isProjectLiked, setIsProjectLiked] = useState(false)

	useEffect(() => {
		setIsProjectLiked(contextUser?.likedProjects.includes(id) || false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contextUser])

	if (errorCode)
		return (
			<Error
				statusCode={errorCode}
				{...(errorCode === 404 ? projectNotFound : {})}
			/>
		)

	const {
		tokenAddress,
		vestingWalletAddress,
		symbol: tokenSymbol,
		totalSupply: tokenTotalSupply,
	} = token

	const { crowdsaleAddress } = crowdsale

	// Process and format token price
	let price: Big | undefined
	try {
		if (status === 'crowdsale') price = Big(crowdsale.rate).pow(-1)
	} catch (e) {}

	let formattedPrice = '-'
	if (price) {
		const stringifyPrice = price.lt(1) ? price.toFixed(4) : price.toFixed(2)
		formattedPrice = '$' + addThousandSeparator(stringifyPrice)
	}

	const formattedTokenTotalSupply = addThousandSeparator(tokenTotalSupply)

	// Process and format market cap
	let marketCap: string | undefined
	if (status === 'live' && tokenTotalSupply && price) {
		try {
			const supply = Big(tokenTotalSupply)
			marketCap = supply.mul(price).toFixed(0)
		} catch (e) {}
	}

	const formattedMarketCap = marketCap && addThousandSeparator(marketCap)

	const formattedStatus = status[0].toUpperCase() + status.slice(1)

	/* const blockTimestamp = Big(Math.ceil(Date.now() / 1000))
	if (status === 'crowdsale') {
		if (blockTimestamp.lte(crowdsale.openingTime)) 1
		if (blockTimestamp.gte(crowdsale.closingTime)) 1
	} */

	// const websiteDomain = getDomainFromUrl(website) || 'website'

	const tokenExplorerUrl = TOKEN_BLOCKCHAIN_EXPLORER_BASE_URL + tokenAddress

	const crowdsaleExplorerUrl =
		ADDR_BLOCKCHAIN_EXPLORER_BASE_URL + crowdsaleAddress

	const vestingWalletExplorerUrl =
		ADDR_BLOCKCHAIN_EXPLORER_BASE_URL + vestingWalletAddress

	// const addToMetamask = () => alert('Add token to MetaMask...')

	const summary = description.blocks.map(({ text }) => text).join(' ')

	const openReportModal = () => {
		if (!contextUser) return setShowAuthModal(true)
		setShowReportModal(true)
	}

	const sendReport = async (message: string) => {
		track('ReportProject')
		console.log(message)
		setReportStatus('success')
	}

	const likeProject = async () => {
		track('LikeProject')
		if (isLikeLoading) return
		if (!contextUser) return setShowAuthModal(true)

		setIsLikeLoading(true)

		const fetchOptions: AxiosRequestHeaders = {
			method: isProjectLiked ? 'DELETE' : 'PUT',
		}

		const { error } = await fetch(
			`/projects/${slug}/likes`,
			fetchOptions,
			contextLogOut
		)

		if (!error) {
			// Update liked projects list
			const newLikedProjects = isProjectLiked
				? contextUser.likedProjects.filter((pId) => pId !== id)
				: [...contextUser.likedProjects, id]

			setContextUser({ ...contextUser, likedProjects: newLikedProjects })

			// Update project likes
			setLikes((prev) => (isProjectLiked ? prev - 1 : prev + 1))
		}

		setIsLikeLoading(false)
	}

	return (
		<>
			<Meta
				title={pagesMetaData.project.title(name)}
				description={summary}
				image={logoUri}
			/>

			<Report
				show={showReportModal}
				onClose={() => setShowReportModal(false)}
				onSend={sendReport}
				status={reportStatus}
				onCloseComplete={() => setReportStatus(null)}
			/>

			<div className={styles.container}>
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
								<h3 className={styles.symbolText}>
									{tokenSymbol}
								</h3>
							</div>
						</div>
						<div className={styles.author}>
							{user?.username ? (
								<>
									{user?.logoUri ? (
										<SkeletonImage
											src={user.logoUri}
											alt={
												(user.username || 'User') +
												' icon'
											}
											className={styles.authorImage}
										/>
									) : null}
									<p className={styles.authorName}>
										@{user.username}
									</p>
								</>
							) : (
								<p className={styles.authorName}>
									user not found
								</p>
							)}
						</div>
						<div className={styles.priceContainer}>
							<div className={styles.price}>
								{formattedPrice}
								<small>USD</small>
							</div>
						</div>
						<div className={styles.tagsContainer}>
							{tags?.map((tag, index) => (
								<div className={styles.tag} key={index}>
									{tag}
								</div>
							))}
						</div>
						<div className={styles.overviewActions}>
							<button
								className={classNames(
									styles.overviewActionButtons,
									styles.likes,
									{ [styles.active]: isProjectLiked }
								)}
								onClick={likeProject}
								title={isProjectLiked ? 'Dislike' : 'Like'}
							>
								{isLikeLoading ? (
									<LoadingSpinner />
								) : (
									<HeartVector />
								)}
								{likes}
							</button>
							<button
								className={classNames(
									styles.overviewActionButtons,
									styles.overviewIconButton
								)}
								onClick={openReportModal}
								title="Report"
							>
								<FlagVector />
							</button>
							<Link href={`/p/${slug}/buy`}>
								<a
									className={styles.investButton}
									target="_self"
									rel="noopener noreferrer"
								>
									Invest
								</a>
							</Link>
						</div>
					</div>
				</div>

				<div className={styles.details}>
					<div className={styles.datum}>
						<h6 className={styles.datumTitle}>Status</h6>
						<p
							className={styles.datumText}
							style={{ textTransform: 'capitalize' }}
						>
							{formattedStatus}
						</p>
					</div>
					{/* {status === 'live' && (
						<Countdown
							status={formattedStatus}
							date={statusEndsAt}
							placeholder="ending in"
						/>
					)}
					{!!statusStartsAt && !statusEndsAt && (
						<Countdown
							status={formattedStatus}
							date={statusStartsAt}
							placeholder="starting in"
						/>
					)} */}
					{!!formattedMarketCap && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>Market cap</h6>
							<p className={styles.datumText}>
								${addThousandSeparator(formattedMarketCap)}
							</p>
						</div>
					)}
					{!!formattedTokenTotalSupply && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>Total supply</h6>
							<p className={styles.datumText}>
								{formattedTokenTotalSupply}
							</p>
						</div>
					)}
				</div>

				{/* <div className={styles.navbar}>
					<button
						className={classNames(styles.navItem, styles.active)}
					>
						Overview
					</button>
					<button className={styles.navItem}>Historical Price</button>
					<button className={styles.navItem}>Comments</button>
				</div> */}

				<div className={styles.overview}>
					<div className={styles.overviewSidebar}>
						<SidebarContract
							label="Token address"
							address={tokenAddress}
							explorerUrl={tokenExplorerUrl}
						/>
						{status === 'crowdsale' && (
							<SidebarContract
								label="Crowdsale address"
								address={crowdsaleAddress}
								explorerUrl={crowdsaleExplorerUrl}
							/>
						)}
						<SidebarContract
							label="Vesting wallet address"
							address={vestingWalletAddress}
							explorerUrl={vestingWalletExplorerUrl}
						/>

						{/* <div className={styles.sidebarDetail}>
							<p className={styles.sidebarTitle}>Website</p>
							<Link href={website}>
								<a
									className={styles.sidebarText}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>{websiteDomain}</span>
									<LinkVector />
								</a>
							</Link>
						</div> */}
						{/* {socialUrls?.length > 0 && (
							<div className={styles.sidebarDetail}>
								<p className={styles.sidebarTitle}>
									Social media
								</p>
								{socialUrls.map((socialMedia, index) => (
									<Link href={socialMedia.url} key={index}>
										<a
											className={styles.socialLink}
											target="_blank"
											rel="noopener noreferrer"
										>
											<span>{socialMedia.name}</span>
											<LinkVector />
										</a>
									</Link>
								))}
							</div>
						)} */}
					</div>

					<div className={styles.overviewContent}>
						{description ? (
							<ViewEditor
								rawState={description}
								className={styles.description}
								NotFoundComponent={DescriptionNotFound}
							/>
						) : (
							<DescriptionNotFound />
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export async function getServerSideProps({
	params,
}: {
	params: { slug: string }
}) {
	const { slug } = params

	const { data: project, error } = await fetch('/projects/' + slug)

	if (error || !project) {
		const errorCode = error?.status || 500
		return { props: { errorCode } }
	}

	return { props: project }
}
