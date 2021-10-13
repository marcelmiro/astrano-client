import { useState, useEffect } from 'react'
import Link from 'next/link'
import classNames from 'classnames'

import {
	pagesMetaData,
	errorData,
	contractAddressLastCharactersLength,
	reportStatuses,
} from '@/constants'
import { Project as IProject } from '@/types'
import { addThousandSeparator, safeMultiplication } from '@/utils/number'
import { copyToClipboard } from '@/utils/element'

import Error from '@/pages/_error'
import Navbar from '@/components/Navbar'
import Meta from '@/components/Meta'
import SkeletonImage from '@/components/SkeletonImage'
import ViewEditor from '@/components/ViewEditor'
import Report from '@/components/Report'

import projects from '@/public/projects.json'
import HeartVector from '@/public/heart.svg'
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

const emptyTimeLeft = [
	{ label: 'days' },
	{ label: 'hours' },
	{ label: 'minutes' },
	{ label: 'seconds' },
]
const calculateTimeLeft = (
	endDate: string
): { label: string; value?: number }[] => {
	const date = endDate ? new Date(endDate) : null
	if (!date) return emptyTimeLeft

	const difference = +date - +new Date()
	if (difference <= 0) return emptyTimeLeft

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

const IcoCountdown = ({ endDate }: { endDate: string }) => {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate))

	useEffect(() => {
		const timer = setTimeout(
			() => setTimeLeft(calculateTimeLeft(endDate)),
			1000
		)
		return () => clearTimeout(timer)
	})

	return (
		<>
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
		</>
	)
}

const DescriptionNotFound = ({ className }: { className?: string }) => (
	<p className={classNames(styles.descriptionNotFound, className)}>
		Project description not found
	</p>
)

export default function Project({
	errorCode,
	name,
	slug,
	symbol,
	totalSupply,
	distributionTax,
	logoUrl,
	contractAddress,
	blockchainExplorerLink,
	type,
	icoEndDate,
	author,
	authorAvatarUrl,
	tags,
	likes,
	price,
	summary,
	description,
	website,
	socialUrls,
}: ProjectProps) {
	const [showReportModal, setShowReportModal] = useState(false)
	const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null)

	if (errorCode) {
		return (
			<Error
				statusCode={errorCode}
				{...(errorCode === 404 ? projectNotFound : {})}
			/>
		)
	}

	const formattedPrice = addThousandSeparator(price)
	const marketCap = safeMultiplication(
		parseInt(totalSupply),
		parseFloat(price)
	)
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

	const copyContractAddress = () => copyToClipboard(contractAddress)

	// const addToMetamask = () => alert('Add token to MetaMask...')

	const closeReport = () => {
		setShowReportModal(false)
		setTimeout(() => setReportStatus(null), 100)
	}

	const sendReport = async (message: string) => {
		setReportStatus('success')
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
				onClose={closeReport}
				onSend={sendReport}
				status={reportStatus}
				tryAgain={() => setReportStatus('')}
			/>

			<Navbar />

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
								<h3 className={styles.symbolText}>{symbol}</h3>
							</div>
						</div>
						<div className={styles.author}>
							<SkeletonImage
								src={authorAvatarUrl}
								alt={author + ' icon'}
								className={styles.authorImage}
							/>
							<p className={styles.authorName}>{author}</p>
						</div>
						<div className={styles.priceContainer}>
							<div className={styles.price}>
								{formattedPrice ? `$${formattedPrice}` : '-'}
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
									styles.likes
								)}
							>
								<HeartVector />
								{likes}
							</button>
							<button
								className={classNames(
									styles.overviewActionButtons,
									styles.overviewIconButton
								)}
								onClick={() => setShowReportModal(true)}
							>
								<FlagVector />
							</button>
							<Link href={`/p/${slug}/buy`}>
								<a
									className={styles.investButton}
									target="_blank"
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
							{type === 'ico' ? 'ICO' : type || 'Live'}
						</p>
					</div>
					{type === 'ico' && icoEndDate && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>ICO ending in</h6>
							<div className={styles.datumCountdown}>
								<IcoCountdown endDate={icoEndDate} />
							</div>
						</div>
					)}
					{marketCap && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>Market cap</h6>
							<p className={styles.datumText}>
								${addThousandSeparator(Math.round(marketCap))}
							</p>
						</div>
					)}
					<div className={styles.datum}>
						<h6 className={styles.datumTitle}>Total supply</h6>
						<p className={styles.datumText}>
							{addThousandSeparator(totalSupply)}
						</p>
					</div>
					{!!distributionTax && (
						<div className={styles.datum}>
							<h6 className={styles.datumTitle}>
								Distribution tax
							</h6>
							<p className={styles.datumText}>
								{distributionTax}%
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
							<p className={styles.sidebarTitle}>BSC explorer</p>
							<Link href={blockchainExplorerLink}>
								<a
									className={styles.sidebarText}
									target="_blank"
									rel="noreferrer"
								>
									<span>bscscan.com</span>
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
									rel="noreferrer"
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
									<Link href={socialMedia.link} key={index}>
										<a
											className={styles.socialLink}
											target="_blank"
											rel="noreferrer"
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
							<>
								<h2 className={styles.overviewTitle}>
									Project Description
								</h2>
								<ViewEditor
									rawState={description}
									className={styles.description}
									notFoundComponent={DescriptionNotFound}
								/>
							</>
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
	const project = projects?.find(
		({ slug: projectSlug }) => projectSlug === slug
	)

	if (!project) return { props: { errorCode: 404 } }
	else return { props: project }
}
