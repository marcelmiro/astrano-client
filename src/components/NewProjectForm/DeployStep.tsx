import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ethers, ContractTransaction } from 'ethers'

import { IUndeployedProject } from '@/types'
import useMetamask, { Chain } from '@/hooks/useMetamask'
import fetch from '@/utils/fetch'
import { address, abi } from '@/contracts/ProjectFactory'
import LoadingSpinner from '@/components/LoadingSpinner'

import MetamaskVector from '@/public/metamask.svg'
import styles from '@/styles/FormStep.module.scss'

const NETWORK_CONFIG: Chain = {
	chainId: '0x61',
	chainName: 'Binance Smart Chain Testnet',
	nativeCurrency: {
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18,
	},
	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
	blockExplorerUrls: ['https://testnet.bscscan.com'],
}

enum MetamaskStatus {
	NOT_INSTALLED = 'not_installed',
	NOT_CONNECTED = 'not_connected',
	WRONG_NETWORK = 'wrong_network',
	CONNECTED = 'connected',
}

interface DeployStepProps {
	project: IUndeployedProject
	setTx(tx: string): void
	deploySuccessful: () => void
}

const DeployButtonContent = () => (
	<div className={styles.deployButtonContent}>
		<LoadingSpinner className={styles.loading} />
		<span>Deploying...</span>
	</div>
)

export default function DeployStep({
	project,
	setTx,
	deploySuccessful,
}: DeployStepProps) {
	const [isDeploying, setIsDeploying] = useState(false)
	const [status, setStatus] = useState<MetamaskStatus>()

	const { provider, account, chainId, connectMetamask, changeNetwork } =
		useMetamask()

	useEffect(() => {
		if (!chainId) setStatus(MetamaskStatus.NOT_INSTALLED)
		else if (!account) setStatus(MetamaskStatus.NOT_CONNECTED)
		else if (chainId === NETWORK_CONFIG.chainId)
			setStatus(MetamaskStatus.CONNECTED)
		else setStatus(MetamaskStatus.WRONG_NETWORK)
	}, [chainId, account])

	const deployProject = async () => {
		if (isDeploying) return
		if (!provider) return alert('Metamask extension not found')
		setIsDeploying(true)
		// TODO: Validate crowdsaleOpeningTime and crowdsaleClosingTime before deploying

		try {
			const input = {
				tokenName: project.token.name,
				tokenSymbol: project.token.symbol,
				tokenTotalSupply: ethers.utils.parseEther(
					project.token.totalSupply
				),
				tokenLockStartIn: project.token.lockStartIn,
				tokenLockDuration: project.token.lockDuration,
				crowdsaleRate: project.crowdsale.rate,
				crowdsaleCap: ethers.utils.parseEther(project.crowdsale.cap),
				crowdsaleIndividualCap: ethers.utils.parseEther(
					project.crowdsale.individualCap
				),
				crowdsaleMinPurchaseAmount: ethers.utils.parseEther(
					project.crowdsale.minPurchaseAmount
				),
				crowdsaleGoal: ethers.utils.parseEther(project.crowdsale.goal),
				crowdsaleOpeningTime: Math.ceil(
					new Date(project.crowdsale.openingTime).getTime() / 1000
				),
				crowdsaleClosingTime: Math.ceil(
					new Date(project.crowdsale.closingTime).getTime() / 1000
				),
				liquidityPercentage: project.liquidity.percentage,
				liquidityRate: project.liquidity.rate,
				liquidityLockStartIn: project.liquidity.lockStartIn,
				liquidityLockDuration: project.liquidity.lockDuration,
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
		</>
	)
}
