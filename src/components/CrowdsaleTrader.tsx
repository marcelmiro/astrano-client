import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Big } from 'big.js'
import { ContractTransaction, ethers } from 'ethers'

import { NETWORK_CONFIG, PAIR_TOKEN_CONFIG } from '@/constants'
import { useAuth } from '@/context/Auth.context'
import { abi as erc20Abi } from '@/contracts/ERC20'
import { abi as crowdsaleAbi } from '@/contracts/Crowdsale'
import { IProject } from '@/types'
import useMetamask, { MetamaskStatus } from '@/hooks/useMetamask'
import SkeletonImage from '@/components/SkeletonImage'
import LoadingSpinner from '@/components/LoadingSpinner'

import ArrowVector from '@/public/arrow.svg'
import styles from '@/styles/CrowdsaleTrader.module.scss'
import { useMixpanel } from '@/context/Mixpanel'

type CrowdsaleTraderProps = Pick<
	IProject,
	'logoUri' | 'token' | 'crowdsale'
> & {
	isOpen?: boolean
	updateTokensSold(): void
}

const BuyButtonContent = () => (
	<div className={styles.buttonContent}>
		<LoadingSpinner className={styles.loading} />
		<span>Buying...</span>
	</div>
)

export default function CrowdsaleTrader({
	logoUri,
	token,
	crowdsale,
	isOpen,
	updateTokensSold,
}: CrowdsaleTraderProps) {
	const { track } = useMixpanel()
	const { user, setShowAuthModal } = useAuth()
	const [buyAmount, setBuyAmount] = useState('')
	const [buyTokenAmount, setBuyTokenAmount] = useState(0)
	const [pairTokenBalance, setPairTokenBalance] = useState('')
	const [crowdsaleBalance, setCrowdsaleBalance] = useState('')
	const [isBuying, setIsBuying] = useState(false)

	const { name, symbol } = token

	const { rate, minPurchaseAmount, crowdsaleAddress } = crowdsale

	const { getProvider, status, account, connectMetamask, changeNetwork } =
		useMetamask()

	const updateBalances = useCallback(async () => {
		const provider = getProvider()
		if (!provider || status !== MetamaskStatus.CONNECTED) return

		const signer = provider.getSigner()
		const PairToken = new ethers.Contract(
			PAIR_TOKEN_CONFIG.address,
			erc20Abi,
			signer
		)
		const Crowdsale = new ethers.Contract(
			crowdsaleAddress,
			crowdsaleAbi,
			signer
		)

		const [tokenBalance, crowdsaleBalance] = await Promise.all([
			PairToken.balanceOf(account),
			Crowdsale.balanceOf(account),
		])

		setPairTokenBalance(ethers.utils.formatEther(tokenBalance))
		setCrowdsaleBalance(ethers.utils.formatEther(crowdsaleBalance))
	}, [getProvider, status, account, crowdsaleAddress])

	useEffect(() => {
		updateBalances()
	}, [updateBalances])

	useEffect(() => {
		let amount = 0
		if (buyAmount) amount = Big(buyAmount).mul(rate).toNumber()
		setBuyTokenAmount(amount)
	}, [buyAmount, rate])

	const onBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value
		if (value.split('.')[1]?.length > 18)
			value = parseFloat(value).toFixed(18)
		setBuyAmount(value)
	}

	const setBuyAmountToBalance = () => {
		const provider = getProvider()
		if (!provider) return alert('Metamask extension not found')
		if (status !== MetamaskStatus.CONNECTED)
			return alert('Metamask not connected')
		setBuyAmount(pairTokenBalance)
	}

	const buy = async () => {
		track('CrowdsaleBuy')
		if (isBuying) return
		if (!user) return setShowAuthModal(true)
		if (!buyAmount) return alert('Select an amount of to buy')
		const provider = getProvider()
		if (!provider) return alert('Metamask extension not found')
		if (status !== MetamaskStatus.CONNECTED)
			return alert('Metamask not connected')

		const bigBuyAmount = Big(buyAmount)

		if (bigBuyAmount.gt(pairTokenBalance))
			return alert(`Insufficient ${PAIR_TOKEN_CONFIG.symbol} balance`)
		if (
			minPurchaseAmount &&
			parseFloat(minPurchaseAmount) !== 0 &&
			bigBuyAmount.lt(minPurchaseAmount)
		) {
			const minTokenAmount = Big(minPurchaseAmount).mul(rate).toString()
			return alert(
				`Minimum purchase amount is ${minTokenAmount} ${symbol}`
			)
		}

		try {
			setIsBuying(true)
			const signer = provider.getSigner()
			const PairToken = new ethers.Contract(
				PAIR_TOKEN_CONFIG.address,
				erc20Abi,
				signer
			)
			const Crowdsale = new ethers.Contract(
				crowdsaleAddress,
				crowdsaleAbi,
				signer
			)

			const isOpen = await Crowdsale.isOpen()
			if (!isOpen) return alert('Crowdsale not open')

			const buyAmountUnits = ethers.utils.parseEther(buyAmount)
			const allowance = await PairToken.allowance(
				account,
				crowdsaleAddress
			)
			if (allowance.lt(buyAmountUnits)) {
				const tx = (await PairToken.approve(
					crowdsaleAddress,
					buyAmountUnits
				)) as ContractTransaction
				await tx.wait()
			}
			const tx = (await Crowdsale.buy(
				account,
				buyAmountUnits
			)) as ContractTransaction
			await tx.wait()
			updateBalances()
			updateTokensSold()
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((e as any)?.data?.message) alert((e as any)?.data?.message)
			else throw e
		} finally {
			setIsBuying(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3 className={styles.title}>Buy {name}</h3>
				<p className={styles.description}>
					Learn how to buy <b>{symbol}</b> by clicking{' '}
					<a
						href="https://docs.astrano.io/tokens/how-to-purchase-crowdsale-tokens"
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
								alt={`${PAIR_TOKEN_CONFIG.symbol} logo`}
								className={styles.tokenLogo}
							/>
							<span className={styles.tokenName}>
								{PAIR_TOKEN_CONFIG.symbol}
							</span>
						</div>

						<button
							className={styles.maxBalance}
							title="Choose maximum amount"
							onClick={setBuyAmountToBalance}
						>
							MAX
						</button>
					</div>

					<label title={`${PAIR_TOKEN_CONFIG.symbol} amount`}>
						<input
							type="text"
							value={buyAmount}
							onChange={onBuyAmountChange}
							inputMode="decimal"
							className={styles.swapInput}
							title={`${PAIR_TOKEN_CONFIG.symbol} amount`}
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
						<div
							className={styles.swapInput}
							title={symbol + ' amount'}
						>
							<span>{buyTokenAmount}</span>
						</div>
					</label>
				</div>

				{status === MetamaskStatus.NOT_INSTALLED && (
					<Link href="https://docs.astrano.io/wallets/create-your-metamask-wallet">
						<a
							target="_blank"
							rel="noopener noreferrer"
							className={styles.button}
						>
							Install Metamask
						</a>
					</Link>
				)}

				{status === MetamaskStatus.NOT_CONNECTED && (
					<button className={styles.button} onClick={connectMetamask}>
						Connect Metamask
					</button>
				)}

				{status === MetamaskStatus.WRONG_NETWORK && (
					<button
						className={styles.button}
						onClick={() => changeNetwork(NETWORK_CONFIG)}
					>
						Switch network
					</button>
				)}

				{status === MetamaskStatus.CONNECTED && (
					<button
						className={styles.button}
						onClick={buy}
						disabled={isBuying || isOpen === false}
					>
						{isBuying ? <BuyButtonContent /> : 'Buy'}
					</button>
				)}

				{!!crowdsaleBalance && parseFloat(crowdsaleBalance) !== 0 && (
					<p className={styles.smallText}>
						Your contribution: {crowdsaleBalance} {symbol}
					</p>
				)}
			</div>
		</div>
	)
}
