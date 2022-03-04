import { useState, useEffect, useRef } from 'react'
import { Big } from 'big.js'
import classNames from 'classnames'

import { INewProjectStepProps } from '@/types'
import { liquidity as liquidityConstants } from '@/constants'
import InputGroup from '@/components/InputGroup'

import styles from '@/styles/FormStep.module.scss'

export default function CrowdsaleStep({
	register,
	errors,
	watch,
	inputGroupDefaults,
}: INewProjectStepProps) {
	const [price, setPrice] = useState(0)
	const percentageValueRef = useRef<HTMLSpanElement>(null)
	const percentageSliderRef = useRef<HTMLInputElement | null>(null)
	const [liquidityPercentage] = watch(['liquidityPercentage'])

	const registerLiquidityPercentage = register('liquidityPercentage', {
		valueAsNumber: true,
		...liquidityConstants.percentage.schema,
	})

	const onRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		if (value.split('.')[1]?.length > 0)
			e.target.value = parseFloat(e.target.value).toFixed(0)
		try {
			setPrice(parseFloat(Big(e.target.value).pow(-1).toFixed(6)))
		} catch (e) {}
	}

	useEffect(() => {
		const input = percentageSliderRef?.current
		const valueEl = percentageValueRef?.current
		if (!input || !valueEl) return

		const thumbSize = 20
		const value = parseFloat(input.value)
		const max = parseFloat(input.max)
		const min = parseFloat(input.min)
		if (
			(!value && value !== 0) ||
			(!max && max !== 0) ||
			(!min && min !== 0)
		) {
			return
		}

		const position = ((value - min) / (max - min)) * input.clientWidth
		const offset =
			Math.round((thumbSize * position) / input.clientWidth) -
			thumbSize / 2 +
			valueEl.clientWidth / 2
		valueEl.style.left = position - offset + 'px'
	}, [liquidityPercentage])

	return (
		<>
			<h2 className={styles.title}>Liquidity details</h2>

			<InputGroup
				label="Percentage"
				help="The percentage of raised funds from the crowdsale that will be used to generate the token's initial liquidity."
				id="liquidityPercentage"
				error={errors.liquidityPercentage?.message}
				{...inputGroupDefaults}
			>
				<div className={styles.sliderContainer}>
					<span
						className={styles.sliderLabel}
						ref={percentageValueRef}
					>
						{liquidityPercentage || 0}%
					</span>
					<input
						{...registerLiquidityPercentage}
						type="range"
						min={liquidityConstants.percentage.min}
						max={liquidityConstants.percentage.max}
						step={liquidityConstants.percentage.step}
						id="liquidityPercentage"
						className={styles.slider}
						ref={(e) => {
							registerLiquidityPercentage.ref(e)
							percentageSliderRef.current = e
						}}
					/>
					<div className={styles.sliderRangeLabels}>
						<span>{liquidityConstants.percentage.min}%</span>
						<span>{liquidityConstants.percentage.max}%</span>
					</div>
				</div>
			</InputGroup>

			<InputGroup
				label="Rate"
				help="Rate is the amount of tokens that investors will receive per dollar ($) when investing during the initial period of the live market. To calculate the amount of tokens that $1 can buy, divide 1 by the rate."
				id="liquidityRate"
				error={errors.liquidityRate?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('liquidityRate', {
						...liquidityConstants.rate.schema,
						valueAsNumber: true,
						onChange: onRateChange,
					})}
					type="number"
					inputMode="numeric"
					step={liquidityConstants.rate.min}
					min={liquidityConstants.rate.min}
					max={liquidityConstants.rate.max}
					maxLength={liquidityConstants.rate.maxLength}
					pattern="[0-9]+"
					placeholder="Rate"
					id="liquidityRate"
					className={styles.textbox}
				/>
			</InputGroup>

			<div className={classNames(styles.inputGroup, styles.infoGroup)}>
				<span className={styles.label}>Price ($)</span>
				<div className={styles.textbox}>{price || '0'}</div>
			</div>

			<InputGroup
				label="Vesting start (days)"
				help={
					<span>
						Vesting start is the amount of time elapsed before
						releasing any liquidity tokens. When supplying liquidity
						for a liquidity pool, an amount of generated tokens is
						given to the supplier as a means to quantify your
						contribution and be able to extract your liquidity from
						the liquidity pool.
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
						), Astrano forces project creators to vest liquidity
						tokens. Token vesting refers to the locking of tokens in
						a smart contract and releasing an incremental amount of
						the locked tokens proportional to the current time. This
						prevents project creators to overflood the token&apos;s
						market or abuse investors that purchase their token.
					</span>
				}
				id="liquidityLockStartIn"
				error={errors.liquidityLockStartIn?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('liquidityLockStartIn', {
						...liquidityConstants.lockStartIn.schema,
						valueAsNumber: true,
					})}
					type="number"
					inputMode="numeric"
					min={liquidityConstants.lockStartIn.min}
					max={liquidityConstants.lockStartIn.max}
					pattern="[0-9]*"
					placeholder="Vesting start (days)"
					id="liquidityLockStartIn"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Vesting duration (days)"
				help={
					<span>
						Vesting duration is the number of days (starting from
						the Vesting start time) until the full amount of locked
						tokens are released. When supplying liquidity for a
						liquidity pool, an amount of generated tokens is given
						to the supplier as a means to quantify your contribution
						and be able to extract your liquidity from the liquidity
						pool.
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
				id="liquidityLockDuration"
				error={errors.liquidityLockDuration?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('liquidityLockDuration', {
						...liquidityConstants.lockDuration.schema,
						valueAsNumber: true,
					})}
					type="number"
					inputMode="numeric"
					min={liquidityConstants.lockDuration.min}
					max={liquidityConstants.lockDuration.max}
					pattern="[0-9]*"
					placeholder="Vesting duration (days)"
					id="liquidityLockDuration"
					className={styles.textbox}
				/>
			</InputGroup>
		</>
	)
}
