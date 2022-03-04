import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Big } from 'big.js'

import { INewProjectStepProps } from '@/types'
import { crowdsale as crowdsaleConstants } from '@/constants'
import { addThousandSeparator } from '@/utils/number'
import InputGroup from '@/components/InputGroup'

import styles from '@/styles/FormStep.module.scss'

export default function CrowdsaleStep({
	register,
	errors,
	setValue,
	watch,
	inputGroupDefaults,
}: INewProjectStepProps) {
	const [price, setPrice] = useState(0)
	const [cap, setCap] = useState('')
	const [goal, setGoal] = useState('')
	const [individualCap, setIndividualCap] = useState('')
	const [openingTime, setOpeningTime] = useState('')
	const [closingTime, setClosingTime] = useState('')
	const [localOpeningTime, setLocalOpeningTime] = useState('')
	const [localClosingTime, setLocalClosingTime] = useState('')

	const onRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.value = e.target.value?.split('.')[0].replace(/\D/g, '')
		try {
			setPrice(parseFloat(Big(e.target.value).pow(-1).toFixed(6)))
		} catch (e) {}
	}

	const onCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value?.split('.')[0].replace(/\D/g, '')
		setValue('crowdsaleCap', value, { shouldValidate: true })
		setCap(value)
	}

	const onGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value?.split('.')[0].replace(/\D/g, '')
		setValue('crowdsaleGoal', value, { shouldValidate: true })
		setGoal(value)
	}

	const onIndividualCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value?.split('.')[0].replace(/\D/g, '')
		setValue('crowdsaleIndividualCap', value, { shouldValidate: true })
		setIndividualCap(value)
	}

	const onOpeningTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.target.value).toISOString()
		if (!date) return
		setOpeningTime(date)
		setValue('crowdsaleOpeningTime', date, { shouldValidate: true })
	}

	const onClosingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.target.value).toISOString()
		if (!date) return
		setClosingTime(date)
		setValue('crowdsaleClosingTime', date, { shouldValidate: true })
	}

	const onMinPurchaseAmountChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value
		if (value.split('.')[1]?.length > 6)
			e.target.value = parseFloat(e.target.value).toFixed(6)
	}

	useEffect(() => {
		register('crowdsaleCap', {
			...crowdsaleConstants.cap.schema,
			validate: {
				...crowdsaleConstants.cap.schema.validate,
				lessThan: (value: string) => {
					const supply = watch('tokenTotalSupply')
					return (
						(supply && Big(value).lte(supply)) ||
						!supply ||
						`Cap must not exceed token supply (${supply})`
					)
				},
			},
		})
		register('crowdsaleGoal', {
			...crowdsaleConstants.goal.schema,
			validate: {
				...crowdsaleConstants.goal.schema.validate,
				lessThan: (value: string) =>
					(cap && Big(value).lte(cap)) ||
					!cap ||
					`Goal must not exceed crowdsale cap (${cap})`,
			},
		})
		register('crowdsaleIndividualCap', {
			...crowdsaleConstants.individualCap.schema,
			validate: {
				...crowdsaleConstants.individualCap.schema.validate,
				lessThan: (value: string) =>
					(cap && Big(value).lte(cap)) ||
					!cap ||
					`Individual cap must not exceed crowdsale cap (${cap})`,
			},
		})
		register('crowdsaleOpeningTime', crowdsaleConstants.openingTime.schema)
		register('crowdsaleClosingTime', {
			...crowdsaleConstants.closingTime.schema,
			validate: {
				...crowdsaleConstants.closingTime.schema.validate,
				futureTime: (value: string) => {
					const date = new Date(value)
					if (!date) return 'Please provide a valid date'
					const opening = new Date(openingTime)
					if (!opening) return true
					return (
						date > opening ||
						'Closing time must be greater than the opening time'
					)
				},
				minCrowdsaleDuration: (value: string) => {
					const date = new Date(value)
					if (!date) return 'Please provide a valid date'
					const opening = new Date(openingTime)
					if (!opening) return true
					const minTime = new Date(opening.getTime() + 1800000) // 30 minutes
					return (
						date >= minTime ||
						'Crowdsale must be open for at least 30 minutes'
					)
				},
				maxCrowdsaleDuration: (value: string) => {
					const date = new Date(value)
					if (!date) return 'Please provide a valid date'
					const opening = new Date(openingTime)
					if (!opening) return true
					const maxTime = new Date(opening.getTime() + 2678400000) // 31 days
					return (
						date <= maxTime ||
						'Crowdsale can only be open for at most 31 days'
					)
				},
			},
		})
	}, [register, watch, cap, openingTime])

	useEffect(() => {
		const date = new Date(openingTime)
		if (!date.getTime()) return
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
		const localDate = date.toISOString().slice(0, 16)
		setLocalOpeningTime(localDate)
	}, [openingTime])

	useEffect(() => {
		const date = new Date(closingTime)
		if (!date.getTime()) return
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
		const localDate = date.toISOString().slice(0, 16)
		setLocalClosingTime(localDate)
	}, [closingTime])

	useEffect(() => {
		setCap(watch('crowdsaleCap') || '')
		setGoal(watch('crowdsaleGoal') || '')
		setIndividualCap(watch('crowdsaleIndividualCap') || '')
		setOpeningTime(watch('crowdsaleOpeningTime') || '')
		setClosingTime(watch('crowdsaleClosingTime') || '')

		try {
			setPrice(parseFloat(Big(watch('crowdsaleRate')).pow(-1).toFixed(6)))
		} catch (e) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<h2 className={styles.title}>Crowdsale details</h2>

			<InputGroup
				label="Rate"
				help="Rate is the amount of tokens that investors will receive per dollar ($) when investing during the crowdsale period. To calculate the amount of tokens that $1 can buy, divide 1 by the rate."
				id="crowdsaleRate"
				error={errors.crowdsaleRate?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('crowdsaleRate', {
						...crowdsaleConstants.rate.schema,
						valueAsNumber: true,
						onChange: onRateChange,
					})}
					type="number"
					inputMode="numeric"
					step={crowdsaleConstants.rate.min}
					min={crowdsaleConstants.rate.min}
					max={crowdsaleConstants.rate.max}
					maxLength={crowdsaleConstants.rate.maxLength}
					pattern="[0-9]+"
					placeholder="Rate"
					id="crowdsaleRate"
					className={styles.textbox}
				/>
			</InputGroup>

			<div className={classNames(styles.inputGroup, styles.infoGroup)}>
				<span className={styles.label}>Price ($)</span>
				<div className={styles.textbox}>{price || '0'}</div>
			</div>

			<InputGroup
				label="Cap"
				help="Maximum amount of tokens allowed to sell by the crowdsale. This amount can't be greater than the token's total supply."
				id="crowdsaleCap"
				error={errors.crowdsaleCap?.message}
				{...inputGroupDefaults}
			>
				<input
					type="text"
					value={addThousandSeparator(cap) || ''}
					onChange={onCapChange}
					inputMode="numeric"
					pattern="[0-9,]*"
					placeholder="Cap"
					id="crowdsaleCap"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Goal"
				help="The crowdsale goal is the minimum amount of tokens that are required to be sold for the crowdsale to be considered successful. If the crowdsale succeeds, the project creator will be able to finalize the project and generate the liquidity to enter the 'live' market. If the crowdsale fails, investors will be able to request refunds of the tokens they purchased."
				id="crowdsaleGoal"
				error={errors.crowdsaleGoal?.message}
				{...inputGroupDefaults}
			>
				<input
					type="text"
					value={addThousandSeparator(goal) || ''}
					onChange={onGoalChange}
					inputMode="numeric"
					pattern="[0-9,]*"
					placeholder="Goal"
					id="crowdsaleGoal"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Individual cap"
				help="To prevent whales holding significant amount of your tokens, a maximum individual cap can be established. This amount can't be greater than the crowdsale cap. If the amount is set to 0 then this constraint will be ignored."
				id="crowdsaleIndividualCap"
				error={errors.crowdsaleIndividualCap?.message}
				{...inputGroupDefaults}
			>
				<input
					type="text"
					value={addThousandSeparator(individualCap) || ''}
					onChange={onIndividualCapChange}
					inputMode="numeric"
					pattern="[0-9,]*"
					placeholder="Individual cap"
					id="crowdsaleIndividualCap"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Minimum purchase amount ($)"
				help="The minimum amount (in dollars) that an investor must purchase. If the amount is set to 0 then this constraint will be ignored."
				id="crowdsaleMinPurchaseAmount"
				error={errors.crowdsaleMinPurchaseAmount?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('crowdsaleMinPurchaseAmount', {
						...crowdsaleConstants.minPurchaseAmount.schema,
						valueAsNumber: true,
						onChange: onMinPurchaseAmountChange,
					})}
					type="number"
					inputMode="numeric"
					step={crowdsaleConstants.minPurchaseAmount.min}
					min={crowdsaleConstants.minPurchaseAmount.min}
					max={crowdsaleConstants.minPurchaseAmount.max}
					pattern="[0-9]+(\.[0-9]+)?"
					placeholder="Minimum purchase amount ($)"
					id="crowdsaleMinPurchaseAmount"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Opening time"
				help="The start time when tokens can start to be sold by the crowdsale. Opening time must be a time in the future."
				id="crowdsaleOpeningTime"
				error={errors.crowdsaleOpeningTime?.message}
				{...inputGroupDefaults}
			>
				<input
					type="datetime-local"
					value={localOpeningTime}
					onChange={onOpeningTimeChange}
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Closing time"
				help="The time when the crowdsale ends and when the crowdsale can't sell more tokens. Closing time must be greater than the opening time."
				id="crowdsaleClosingTime"
				error={errors.crowdsaleClosingTime?.message}
				{...inputGroupDefaults}
			>
				<input
					type="datetime-local"
					value={localClosingTime}
					onChange={onClosingTimeChange}
					className={styles.textbox}
				/>
			</InputGroup>
		</>
	)
}
