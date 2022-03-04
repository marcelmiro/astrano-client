import { useState } from 'react'
import Link from 'next/link'
import { ethers, ContractTransaction } from 'ethers'

import { NETWORK_CONFIG } from '@/constants'
import { IUndeployedProject } from '@/types'
import useMetamask, { MetamaskStatus } from '@/hooks/useMetamask'
import fetch from '@/utils/fetch'
import { address, abi } from '@/contracts/ProjectFactory'
import LoadingSpinner from '@/components/LoadingSpinner'

import MetamaskVector from '@/public/metamask.svg'
import styles from '@/styles/FormStep.module.scss'
import { useMixpanel } from '@/context/Mixpanel'

interface DeployStepProps {
	project: IUndeployedProject
	setTx(tx: string): void
	deploySuccessful(): void
	cancelProject(): void
}

const DeployButtonContent = () => (
	<div className={styles.deployButtonContent}>
		<LoadingSpinner className={styles.loading} />
		<span>Deploying...</span>
	</div>
)

const DeleteButtonContent = () => (
	<div className={styles.deployButtonContent}>
		<LoadingSpinner className={styles.loading} />
		<span>Canceling...</span>
	</div>
)

export default function DeployStep({
	project,
	setTx,
	deploySuccessful,
	cancelProject,
}: DeployStepProps) {
	const { track } = useMixpanel()
	const [isDeploying, setIsDeploying] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const { status, provider, connectMetamask, changeNetwork } = useMetamask()

	const deployProject = async () => {
		track('DeployProject')
		if (isDeploying) return
		if (!provider) return alert('Metamask extension not found')
		setIsDeploying(true)
		// TODO: Validate crowdsaleOpeningTime and crowdsaleClosingTime before deploying

		const dayInSeconds = 60 * 60 * 24

		try {
			const input = {
				tokenName: project.token.name,
				tokenSymbol: project.token.symbol,
				tokenTotalSupply: ethers.utils.parseEther(
					project.token.totalSupply
				),
				tokenLockStartIn:
					parseInt(project.token.lockStartIn) * dayInSeconds,
				tokenLockDuration:
					parseInt(project.token.lockDuration) * dayInSeconds,
				crowdsaleRate: project.crowdsale.rate,
				crowdsaleCap: ethers.utils.parseEther(project.crowdsale.cap),
				crowdsaleIndividualCap: ethers.utils.parseEther(
					project.crowdsale.individualCap
				),
				crowdsaleMinPurchaseAmount: ethers.utils.parseEther(
					project.crowdsale.minPurchaseAmount
				),
				crowdsaleGoal: ethers.utils.parseEther(project.crowdsale.goal),
				crowdsaleOpeningTime: Math.floor(
					new Date(project.crowdsale.openingTime).getTime() / 1000
				),
				crowdsaleClosingTime: Math.floor(
					new Date(project.crowdsale.closingTime).getTime() / 1000
				),
				liquidityPercentage: project.liquidity.percentage,
				liquidityRate: project.liquidity.rate,
				liquidityLockStartIn:
					parseInt(project.liquidity.lockStartIn) * dayInSeconds,
				liquidityLockDuration:
					parseInt(project.liquidity.lockDuration) * dayInSeconds,
			}

			const signer = provider.getSigner()
			const ProjectFactory = new ethers.Contract(address, abi, signer)

			const creationFee = await ProjectFactory.creationFee()
			const tx = (await ProjectFactory.createProject(input, {
				value: creationFee,
			})) as ContractTransaction

			setTx(tx.hash)
			deploySuccessful()

			const receipt = await tx.wait()

			const event = receipt.events?.find(
				(ev) => ev.event === 'ProjectCreated'
			)

			const [, tokenAddress, crowdsaleAddress, vestingWalletAddress] =
				event?.args || []

			const data = {
				tokenAddress,
				crowdsaleAddress,
				vestingWalletAddress,
			}
			await fetch('/projects/deploy', { method: 'POST', data })
		} catch (e) {
			throw e
		} finally {
			setIsDeploying(false)
		}
	}

	const deleteProject = async () => {
		track('DeleteUndeployedProject')
		setIsDeleting(true)
		try {
			await fetch('/projects/deploy', { method: 'DELETE' })
			cancelProject()
		} catch (e) {
			throw e
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<>
			<p className={styles.text}>
				Time to deploy your project to the blockchain! To do this,
				please install Metamask and transfer some BNB to cover the
				project creation and gas fees. Currently, Astrano&apos;s project
				creation fee is 0.01 BNB. For more information on how to deploy,
				please visit our{' '}
				<Link href="https://docs.astrano.io/">
					<a target="_blank" rel="noopener noreferrer">
						docs
					</a>
				</Link>
				.
			</p>

			{status === MetamaskStatus.NOT_INSTALLED && (
				<p className={styles.text}>
					Metamask extension not found. You can find more information
					about Metamask and how to install it by visiting our{' '}
					<Link href="https://docs.astrano.io/">
						<a target="_blank" rel="noopener noreferrer">
							docs
						</a>
					</Link>
					.
				</p>
			)}

			{status === MetamaskStatus.NOT_CONNECTED && (
				<button
					className={styles.deployButton}
					onClick={connectMetamask}
				>
					<MetamaskVector />
					Connect to Metamask
				</button>
			)}

			{status === MetamaskStatus.WRONG_NETWORK && (
				<button
					className={styles.deployButton}
					onClick={() => changeNetwork(NETWORK_CONFIG)}
				>
					<MetamaskVector />
					Switch network
				</button>
			)}

			{status === MetamaskStatus.CONNECTED && (
				<button className={styles.deployButton} onClick={deployProject}>
					{isDeploying ? (
						<DeployButtonContent />
					) : (
						'Deploy smart contracts'
					)}
				</button>
			)}

			<button
				className={styles.deployButtonSecondary}
				onClick={deleteProject}
			>
				{isDeleting ? <DeleteButtonContent /> : 'Cancel project'}
			</button>
		</>
	)
}
