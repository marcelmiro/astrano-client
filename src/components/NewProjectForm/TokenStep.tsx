import { useState, useEffect } from 'react'
import classNames from 'classnames'
import Big from 'big.js'

import { INewProjectStepProps } from '@/types'
import { token as tokenConstants, tokenCreationTax } from '@/constants'
import { addThousandSeparator } from '@/utils/number'
import InputGroup from '@/components/InputGroup'

import styles from '@/styles/FormStep.module.scss'

export default function TokenStep({
	register,
	errors,
	setValue,
	watch,
	inputGroupDefaults,
}: INewProjectStepProps) {
	const [totalSupply, setTotalSupply] = useState('')
	const [receivedSupply, setReceivedSupply] = useState('')

	const onSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.value = e.target.value?.toUpperCase() || ''
	}

	const onSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value?.split('.')[0].replace(/\D/g, '')
		setValue('tokenTotalSupply', value, { shouldValidate: true })
		setTotalSupply(value)
	}

	useEffect(() => {
		try {
			const supply = Big(totalSupply)
			if (supply.toString().length > tokenConstants.totalSupply.maxLength)
				return setReceivedSupply('0')

			const receivedSupply = supply
				.mul(1 - tokenCreationTax)
				.round(0, Big.roundDown)

			setReceivedSupply(receivedSupply.toString() || '0')
		} catch (e) {
			setReceivedSupply('0')
		}
	}, [totalSupply])

	useEffect(() => {
		register('tokenTotalSupply', {
			...tokenConstants.totalSupply.schema,
			validate: {
				...tokenConstants.totalSupply.schema.validate,
				insufSupply: (value: string) => {
					const supply = Big(value)
					const [
						crowdsaleCap,
						crowdsaleRate,
						liquidityPercentage,
						liquidityRate,
					] = watch([
						'crowdsaleCap',
						'crowdsaleRate',
						'liquidityPercentage',
						'liquidityPercentage',
						'liquidityRate',
					])
					const cap = crowdsaleCap ? Big(crowdsaleCap) : 0
					const tokenFeeAmount = supply
						.mul(4)
						.div(100)
						.toFixed(0, Big.roundDown)
					const maxLiquidityPairTokenAmount = cap
						? cap
								.div(crowdsaleRate)
								.mul(liquidityPercentage)
								.div(100)
								.toFixed(0, Big.roundDown)
						: 0
					const maxLiquidityTokenAmount = maxLiquidityPairTokenAmount
						? Big(maxLiquidityPairTokenAmount).mul(
								liquidityRate || 0
						  )
						: 0
					const requiredAmount = Big(tokenFeeAmount)
						.add(cap)
						.add(maxLiquidityTokenAmount)
					return (
						supply.gte(requiredAmount) ||
						`Total supply is insufficient. Either increase total supply to ${addThousandSeparator(
							requiredAmount.toString()
						)} or decrease tokens needed for crowdsale, liquidity and the Astrano fee.`
					)
				},
			},
		})
	}, [register, watch])

	useEffect(() => {
		setTotalSupply(watch('tokenTotalSupply') || '')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<h2 className={styles.title}>Token details</h2>

			<InputGroup
				label="Name"
				help="This is the token name that will be deployed to the blockchain."
				id="tokenName"
				error={errors.tokenName?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('tokenName', tokenConstants.name.schema)}
					type="text"
					minLength={tokenConstants.name.minLength}
					placeholder="Name"
					id="name"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Ticker/Symbol"
				help="Abbreviation of the token name used to uniquely identify tokens for trading purposes."
				id="tokenSymbol"
				error={errors.tokenSymbol?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('tokenSymbol', {
						...tokenConstants.symbol.schema,
						onChange: onSymbolChange,
					})}
					type="text"
					minLength={tokenConstants.symbol.minLength}
					placeholder="Ticker/Symbol"
					id="tokenSymbol"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Total supply"
				help={`Total number of tokens to create. This number cannot be changed in the future and new tokens cannot be minted. The default and recommended value to use is 21,000,000. Astrano will keep ${
					tokenCreationTax * 100
				}% of the tokens created.`}
				id="tokenTotalSupply"
				error={errors.tokenTotalSupply?.message}
				{...inputGroupDefaults}
			>
				<input
					type="text"
					value={addThousandSeparator(totalSupply) || ''}
					onChange={onSupplyChange}
					inputMode="numeric"
					pattern="[0-9,]*"
					placeholder="Total supply"
					id="tokenTotalSupply"
					className={styles.textbox}
				/>
			</InputGroup>

			<div className={classNames(styles.inputGroup, styles.infoGroup)}>
				<span className={styles.label}>You will get</span>
				<div className={styles.textbox}>
					{addThousandSeparator(receivedSupply) || '0'}
				</div>
				<span className={styles.label}>tokens</span>
			</div>

			<InputGroup
				label="Vesting start (days)"
				help={
					<span>
						Vesting start is the amount of time elapsed before
						releasing any tokens.
						<br />
						<br />
						To prevent rug pulls (learn about rug pulls in
						<a
							href="https://docs.astrano.io/"
							target="_blank"
							rel="noopener noreferrer"
						>
							docs.astrano.io
						</a>
						), Astrano forces project creators to vest their unused
						tokens. Token vesting refers to the locking of tokens in
						a smart contract and releasing an incremental amount of
						the locked tokens proportional to the current time. This
						prevents project creators to overflood the token&apos;s
						market or abuse investors that purchase their token.
					</span>
				}
				id="tokenLockStartIn"
				error={errors.tokenLockStartIn?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('tokenLockStartIn', {
						...tokenConstants.lockStartIn.schema,
						valueAsNumber: true,
					})}
					type="number"
					inputMode="numeric"
					min={tokenConstants.lockStartIn.min}
					max={tokenConstants.lockStartIn.max}
					pattern="[0-9]*"
					placeholder="Vesting start (days)"
					id="tokenLockStartIn"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Vesting duration (days)"
				help={
					<span>
						Vesting duration is the number of days (starting from
						the vesting start time) until the full amount of locked
						tokens are released.
						<br />
						<br />
						To prevent rug pulls (learn about rug pulls in
						<a
							href="https://docs.astrano.io/"
							target="_blank"
							rel="noopener noreferrer"
						>
							docs.astrano.io
						</a>
						), Astrano forces project creators to vest their unused
						tokens. Token vesting refers to the locking of tokens in
						a smart contract and releasing an incremental amount of
						the locked tokens proportional to the current time. This
						prevents project creators to overflood the token&apos;s
						market or abuse investors that purchase their token.
					</span>
				}
				id="tokenLockDuration"
				error={errors.tokenLockDuration?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('tokenLockDuration', {
						...tokenConstants.lockDuration.schema,
						valueAsNumber: true,
					})}
					type="number"
					inputMode="numeric"
					min={tokenConstants.lockDuration.min}
					max={tokenConstants.lockDuration.max}
					pattern="[0-9]*"
					placeholder="Vesting duration (days)"
					id="tokenLockDuration"
					className={styles.textbox}
				/>
			</InputGroup>
		</>
	)
}
