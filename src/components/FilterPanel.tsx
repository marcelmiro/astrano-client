import React, { useState, useEffect } from 'react'
import { useRouter, NextRouter } from 'next/router'
import Link from 'next/link'

import { getItems, addItems } from '../helpers/urlQuery'

import Dropdown from './Dropdown'
import Filter from './Filter'
import CheckboxList from './CheckboxList'
import BorderGradient from './BorderGradient'
import ArrowVector from '../../public/arrow.svg'
import CrossVector from '../../public/cross.svg'
import ExclamationVector from '../../public/exclamation.svg'
import styles from '../styles/FilterPanel.module.scss'

interface IDropdown {
	value?: string
	setter: (value: any) => void
	items: Array<{
		label: string
		value: string
		labelIcon?: React.ReactElement
	}>
	storage?: string
}

interface IFilter {
	title: string
	setter: (value: any) => void
	items: Array<{
		label: string
		value: string
	}>
	query?: string
}

interface IPriceItem {
	label: string
	min?: number
	max?: number
}

interface IPriceFilter extends Omit<IFilter, 'items'> {
	items: IPriceItem[]
}

interface FilterPanelProps {
	sort: IDropdown
	view: IDropdown
	priceFilter: IPriceFilter
	tokenFilter: IFilter
	projectFilter: IFilter
	// otherFilter: IFilter
}

interface IPriceRange {
	min?: number | string
	max?: number | string
}

const FLOAT_REGEX = new RegExp(`^(\\d*\\.)?\\d+$`)
const validatePriceRange = (
	min?: number | string,
	max?: number | string
): { error?: string; min?: number; max?: number } => {
	if (min || typeof min === 'number') {
		if (typeof min === 'string') {
			if (!FLOAT_REGEX.test(min)) {
				return { error: 'Please provide a valid price range' }
			}
			min = parseFloat(min)
		}
		if ((min || typeof min === 'number') && min < 0) {
			return { error: 'Minimum price must be a positive number' }
		}
	} else min = undefined
	if (!min && min !== 0) min = undefined

	if (max || typeof max === 'number') {
		if (typeof max === 'string') {
			if (!FLOAT_REGEX.test(max)) {
				return { error: 'Please provide a valid price range' }
			}
			max = parseFloat(max)
		}
		if ((max || typeof max === 'number') && max <= 0) {
			return { error: 'Maximum price must be greater than 0' }
		}
	} else max = undefined
	if (!max && max !== 0) min = undefined

	if (min && max && min > max) {
		return { error: 'Please provide a valid price range' }
	}

	return { min, max }
}

const addPriceQuery = (router: NextRouter, { min, max }: IPriceRange) => {
	if (typeof min === 'number') {
		min = min || min === 0 ? min.toString() || undefined : undefined
	}
	if (typeof max === 'number') {
		max = max || max === 0 ? max.toString() || undefined : undefined
	}
	addItems(router, { min, max })
}

export default function FilterPanel({
	sort,
	view,
	priceFilter,
	tokenFilter,
	projectFilter,
}: // otherFilter,
FilterPanelProps) {
	const router = useRouter()
	const [selectedPriceIndex, setSelectedPriceIndex] = useState(-1)
	const [priceRange, setPriceRange] = useState<{
		min?: string
		max?: string
	}>({})
	const [priceRangeError, setPriceRangeError] = useState('')

	// Reset filters with references
	const resetRefs: { reset?: () => void }[] = []
	const addResetRef = (ref: { reset?: () => void }) => resetRefs.push(ref)
	const resetFilters = () => {
		resetPriceFilter()
		for (const ref of resetRefs) ref?.reset?.()
	}

	const togglePriceValue = (index: number) => {
		setSelectedPriceIndex(index)
		const { min, max } = priceFilter.items[index]
		setPriceRange({})
		setPriceRangeError('')
		priceFilter.setter({ min, max })
		addPriceQuery(router, { min, max })
	}

	const resetPriceFilter = () => {
		setSelectedPriceIndex(-1)
		setPriceRange({})
		setPriceRangeError('')
		priceFilter.setter({})
		addPriceQuery(router, {})
	}

	const handleCustomInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		key: string
	) => {
		// FIXME: priceRangeError equals to last re-render's state so it's outdated
		if (priceRangeError) {
			const { error } = validatePriceRange(priceRange.min, priceRange.max)
			console.log(error)
			setPriceRangeError((prevError) => prevError || error || '')
		}

		setPriceRange((prevState) => ({
			...prevState,
			[key]: e.target.value,
		}))
	}

	const submitPriceRange = () => {
		// TODO: Validate price range
		const { error, min, max } = validatePriceRange(
			priceRange.min,
			priceRange.max
		)
		if (error) return setPriceRangeError(error)

		setSelectedPriceIndex(-1)
		setPriceRangeError('')
		priceFilter.setter({ min, max })
		addPriceQuery(router, { min, max })
	}

	const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		submitPriceRange()
		;(e.target as HTMLInputElement).blur()
	}

	// On router ready
	useEffect(() => {
		if (!router.isReady) return

		// Check items included in URL query
		const [queryMin, queryMax] = getItems(router, ['min', 'max'])

		const min =
			queryMin && typeof queryMin === 'string'
				? parseFloat(queryMin) || undefined
				: undefined
		const max =
			queryMax && typeof queryMax === 'string'
				? parseFloat(queryMax) || undefined
				: undefined

		if (!min && !max) return
		const priceItemIndex = priceFilter.items.findIndex(
			(item) => item.min === min && item.max === max
		)

		priceFilter.setter({ min, max })
		if (priceItemIndex > -1) setSelectedPriceIndex(priceItemIndex)
		else {
			// TODO: Validate price range
			setPriceRange({ min: min?.toString(), max: max?.toString() })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady])

	return (
		<div className={styles.container}>
			<Dropdown
				value={sort.value}
				onChange={sort.setter}
				items={sort.items}
				storage={sort.storage}
				className={styles.action}
			/>

			<Dropdown
				value={view.value}
				onChange={view.setter}
				items={view.items}
				storage={view.storage}
				className={styles.action}
			/>

			<div className={styles.divider} />

			<div className={styles.filters}>
				<Filter title={priceFilter.title} className={styles.filter}>
					<div className={styles.filterContainer}>
						{priceFilter.items?.map(({ label }, index) => (
							<label className={styles.item} key={index}>
								<input
									type="radio"
									value={label}
									name={priceFilter.title}
									checked={index === selectedPriceIndex}
									onChange={() => togglePriceValue(index)}
								/>
								<div className={styles.radio} />
								{label}
							</label>
						))}
						<div className={styles.customItem}>
							<label className={styles.customLabel}>
								$
								<input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									autoComplete="false"
									value={priceRange.min || ''}
									onChange={(e) =>
										handleCustomInputChange(e, 'min')
									}
									onKeyPress={onKeyPress}
									className={styles.customInput}
								/>
								<BorderGradient
									borderRadius={5}
									className={styles.inputBorder}
								/>
							</label>
							<span>to</span>
							<label className={styles.customLabel}>
								$
								<input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									autoComplete="false"
									value={priceRange.max || ''}
									onChange={(e) =>
										handleCustomInputChange(e, 'max')
									}
									onKeyPress={onKeyPress}
									className={styles.customInput}
								/>
								<BorderGradient
									borderRadius={5}
									className={styles.inputBorder}
								/>
							</label>
							<button
								onClick={submitPriceRange}
								className={styles.customSubmit}
							>
								<ArrowVector />
							</button>
						</div>
						{priceRangeError && (
							<div className={styles.customError}>
								<ExclamationVector />
								{priceRangeError}
							</div>
						)}
					</div>
				</Filter>

				<Filter title={tokenFilter.title} className={styles.filter}>
					<CheckboxList
						title={tokenFilter.title}
						items={tokenFilter.items}
						onChange={tokenFilter.setter}
						maxShownItems={10}
						query={tokenFilter.query}
						ref={addResetRef}
					/>
				</Filter>

				<Filter title={projectFilter.title} className={styles.filter}>
					<CheckboxList
						title={projectFilter.title}
						items={projectFilter.items}
						onChange={projectFilter.setter}
						maxShownItems={10}
						query={projectFilter.query}
						ref={addResetRef}
					/>
				</Filter>

				{/* <Filter title={otherFilter.title} className={styles.filter}>
					<CheckboxList
						title={otherFilter.title}
						items={otherFilter.items}
						onChange={otherFilter.setter}
						query={otherFilter.query}
						ref={addResetRef}
					/>
				</Filter> */}

				<div className={styles.divider} />

				<button className={styles.reset} onClick={resetFilters}>
					<CrossVector />
					Reset filters
				</button>

				<div className={styles.footer}>
					<a
						href="https://astrano.io/#about"
						target="_blank"
						rel="noreferrer"
					>
						About
					</a>
					<Link href="/">
						<a>Terms of Service</a>
					</Link>
					<Link href="/">
						<a>Privacy Policy</a>
					</Link>
					<Link href="/">
						<a>Cookie Policy</a>
					</Link>
					<p>© 2021 ASTRANO</p>
				</div>
			</div>
		</div>
	)
}
