import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import { getItem, addItems } from '@/helpers/urlQuery'

import CheckVector from '@/public/check.svg'
import ArrowHead from '@/public/arrowhead.svg'
import styles from '@/styles/CheckboxList.module.scss'

interface IItem {
	label: string
	value: string
	checked?: boolean
}

interface CheckboxListProps {
	title: string
	items: IItem[]
	onChange?(data: IItem['value'][]): void
	maxShownItems?: number
	maxCheckedItems?: number
	query?: string
	className?: string
}

export default React.forwardRef(function CheckboxList(
	{
		title,
		items,
		onChange,
		maxShownItems,
		maxCheckedItems,
		query,
		className,
	}: CheckboxListProps,
	ref: React.Ref<unknown>
) {
	const router = useRouter()
	const [data, setData] = useState(() => {
		return (
			items?.map((item) => ({
				...item,
				checked: item.checked || false,
			})) || []
		)
	})
	const [showAll, setShowAll] = useState(false)
	const isMounted = useRef(false)

	// Reset function
	const reset = () => {
		const newData = data.map((item) => ({ ...item, checked: false }))
		setData(newData)
	}
	React.useImperativeHandle(ref, () => ({ reset }))

	// On router ready
	useEffect(() => {
		if (!query || !router.isReady) return

		// Check items included in URL query
		const queryValue = getItem(router, query)
		const queryArray = queryValue
			? typeof queryValue === 'string'
				? [queryValue]
				: queryValue
			: undefined
		if (queryArray && queryArray.length > 0) {
			const newData = data.map((item) => ({
				...item,
				checked: item.checked || queryArray.includes(item.value),
			}))
			setData(newData)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady])

	// On data change
	useEffect(() => {
		if (!isMounted.current) return
		const checkedItemValues = data
			.filter((item) => item.checked)
			.map((item) => item.value)
		if (onChange) onChange(checkedItemValues)
		if (query) addItems(router, { [query]: checkedItemValues })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	// On component mount
	useEffect(() => {
		isMounted.current = true
	}, [])

	const toggleChecked = (index: number) => {
		const newData = data.map((item, itemIndex) => ({
			...item,
			checked: itemIndex === index ? !item.checked : item.checked,
		}))
		if (
			maxCheckedItems &&
			newData[index].checked &&
			newData.filter((item) => item.checked).length > maxCheckedItems
		) {
			return
		}
		setData(newData)
	}

	return (
		<div className={classNames(styles.container, className)}>
			{data &&
				data.length > 0 &&
				data
					.slice(
						0,
						maxShownItems &&
							items.length > maxShownItems &&
							!showAll
							? maxShownItems
							: items.length
					)
					.map(({ label, checked }, index) => (
						<label className={styles.item} key={index}>
							<input
								type="checkbox"
								value={label}
								name={title}
								checked={checked}
								onChange={() => toggleChecked(index)}
							/>
							<div className={styles.checkbox}>
								<CheckVector className={styles.checkboxIcon} />
							</div>
							{label}
						</label>
					))}

			{maxShownItems && data.length > maxShownItems && !showAll && (
				<button
					className={styles.viewMore}
					onClick={() => setShowAll(true)}
				>
					<ArrowHead />
					View more
				</button>
			)}
		</div>
	)
})
