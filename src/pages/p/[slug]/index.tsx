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
import { copyToClipboard } from '@/utils/element'
import fetch from '@/utils/fetch'
import { useAuth } from '@/context/Auth.context'

import Error from '@/pages/_error'
import Meta from '@/components/Meta'
import SkeletonImage from '@/components/SkeletonImage'
import ViewEditor from '@/components/ViewEditor'
import Report from '@/components/Report'
import LoadingSpinner from '@/components/LoadingSpinner'

import HeartVector from '@/public/heart-filled.svg'
import FlagVector from '@/public/flag.svg'
import CopyVector from '@/public/copy.svg'
import LinkVector from '@/public/link.svg'
// import MetamaskVector from '@/public/metamask.svg'
import styles from '@/styles/Project.module.scss'

const { projectNotFound } = errorData

type ReportStatus = typeof reportStatuses[number]

interface ProjectProps extends IProject {
	errorCode?: number
}

interface CountdownProps {
	status: string
	date: Date
	placeholder: string
}

const getDomainFromUrl = (url: string): string | undefined => {
	if (!url || typeof url !== 'string') return
	try {
		const urlObject = new URL(url)
		const hostname = urlObject?.hostname
		if (!hostname) return
		return hostname.startsWith('www.') ? hostname.slice(4) : hostname
	} catch (e) {
		return
	}
}

const calculateTimeLeft = (
	endDate: Date
): { label: string; value?: number }[] | null => {
	const date = endDate ? new Date(endDate) : null
	if (!date) return null

	const difference = +date - +new Date()
	if (difference <= 0) return null

	const timeLeft = [
		{
			label: 'days',
			value: Math.floor(difference / (1000 * 60 * 60 * 24)),
		},
		{
			label: 'hours',
			value: Math.floor((difference / (1000 * 60 * 60)) % 24),
		},
		{
			label: 'minutes',
			value: Math.floor((difference / 1000 / 60) % 60),
		},
		{
			label: 'seconds',
			value: Math.floor((difference / 1000) % 60),
		},
	]

	const processedTimeLeft: { label: string; value: number }[] = []

	let breakFlag = true
	timeLeft.forEach((interval) => {
		if (breakFlag && !interval.value) return
		breakFlag = false
		processedTimeLeft.push(interval)
	})

	return processedTimeLeft
}

const Countdown = ({ status, date, placeholder }: CountdownProps) => {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date))

	useEffect(() => {
		const timer = setTimeout(
			() => setTimeLeft(calculateTimeLeft(date)),
			1000
		)
		return () => clearTimeout(timer)
	})

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
}

const DescriptionNotFound = ({ className }: { className?: string }) => (
	<p className={classNames(styles.descriptionNotFound, className)}>
		Project description not found
	</p>
)

export default function Project({
	errorCode,
	_id: id,
	name,
	slug,
	logoUrl,
	user,
	tags,
	summary,
	description,
	token,
	status: statusObject,
	website,
	socialUrls,
	likes: _likes,
}: ProjectProps) {
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

	if (errorCode)
		return (
			<Error
				statusCode={errorCode}
				{...(errorCode === 404 ? projectNotFound : {})}
			/>
		)

	const {
		contractAddress,
		blockchainExplorerUrl,
		symbol: tokenSymbol,
		totalSupply: _tokenSupply,
		// decimals: tokenDecimals,
		distributionTax: tokenDistributionTax,
		price: _price,
	} = token

	const {
		name: status,
		startsAt: statusStartsAt,
		endsAt: statusEndsAt,
	} = statusObject

	let price: Big | undefined
	try {
		price = Big(_price)
	} catch (e) {}

	let formattedPrice = '-'
	if (price) {
		const stringifyPrice = price.lt(1) ? price.toFixed(4) : price.toFixed(2)
		formattedPrice = '$' + addThousandSeparator(stringifyPrice)
	}

	let tokenSupply: Big | undefined
	try {
		tokenSupply = Big(_tokenSupply)
	} catch (e) {}

	const formattedTokenSupply =
		tokenSupply && addThousandSeparator(tokenSupply.toString())

	let marketCap: string | undefined
	if (tokenSupply && price) {
		try {
			marketCap = tokenSupply.mul(price)?.toFixed(0)
		} catch (e) {}
	}

	const formattedMarketCap = marketCap && addThousandSeparator(marketCap)

	const formattedStatus =
		status === 'ico' ? 'ICO' : status[0].toUpperCase() + status.slice(1)

	const splitContractAddress = [
		contractAddress.slice(
			0,
			contractAddress.length - contractAddressLastCharactersLength
		),
		contractAddress.slice(
			contractAddress.length - contractAddressLastCharactersLength,
			contractAddress.length
		),
	]

	const websiteDomain = getDomainFromUrl(website) || 'website'

	const blockchainExplorerDomain =
		getDomainFromUrl(blockchainExplorerUrl) || 'website'

	const copyContractAddress = () => copyToClipboard(contractAddress)

	// const addToMetamask = () => alert('Add token to MetaMask...')

	const openReportModal = () => {
		if (!contextUser) return setShowAuthModal(true)
		setShowReportModal(true)
	}

	const sendReport = async (message: string) => {
		setReportStatus('success')
	}

	const isProjectLiked = contextUser?.likedProjects.includes(id) || false

	const likeProject = async () => {
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
				image={logoUrl}
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
						src={logoUrl}
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
									{user?.logoUrl ? (
										<SkeletonImage
											src={user.logoUrl}
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
							>
								<FlagVector />
							</button>
							<Link href={`/p/${slug}/buy`}>
								<a
									className={styles.investButton}
									target="_blank"
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
					{!!statusEndsAt && status !== 'live' && (
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
					)}
					{!!formattedMarketCap && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>Market cap</h6>
							<p className={styles.datumText}>
								${addThousandSeparator(formattedMarketCap)}
							</p>
						</div>
					)}
					{!!formattedTokenSupply && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>Total supply</h6>
							<p className={styles.datumText}>
								{formattedTokenSupply}
							</p>
						</div>
					)}
					{!!tokenDistributionTax && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>
								Distribution tax
							</h6>
							<p className={styles.datumText}>
								{tokenDistributionTax}%
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
						<div className={styles.sidebarDetail}>
							<p className={styles.sidebarTitle}>
								Contract address
							</p>
							<div
								className={classNames(
									styles.sidebarText,
									styles.contractAddress
								)}
							>
								<span className={styles.contractAddressStart}>
									{splitContractAddress[0]}
								</span>
								<span className={styles.contractAddressEnd}>
									{splitContractAddress[1]}
								</span>
								<button
									onClick={copyContractAddress}
									className={styles.sidebarIconButton}
									title="Copy contract address"
								>
									<CopyVector />
								</button>
								{/* <button
									onClick={addToMetamask}
									className={classNames(
										styles.sidebarIconButton,
										styles.metamaskIcon
									)}
									title="Add token to MetaMask"
								>
									<MetamaskVector />
								</button> */}
							</div>
						</div>
						<div className={styles.sidebarDetail}>
							<p className={styles.sidebarTitle}>
								Blockchain explorer
							</p>
							<Link href={blockchainExplorerUrl}>
								<a
									className={styles.sidebarText}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>{blockchainExplorerDomain}</span>
									<LinkVector />
								</a>
							</Link>
						</div>
						<div className={styles.sidebarDetail}>
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
						</div>
						{socialUrls?.length > 0 && (
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
						)}
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
