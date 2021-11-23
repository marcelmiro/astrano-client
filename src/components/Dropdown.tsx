import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { setItem } from '@/helpers/localStorage'
import { handleBlur } from '@/utils/element'

import ArrowHead from '@/public/arrowhead.svg'
import styles from '@/styles/Dropdown.module.scss'

interface IItem {
	label: string
	value: string
	/* eslint-disable @typescript-eslint/no-explicit-any */
	labelIcon?: any
}

interface DropdownProps {
	value?: IItem['value']
	onChange?(value: string): void
	items: IItem[]
	storage?: string
	className?: string
}

const getItemFromValue = (
	value: IItem['value'] | undefined,
	items: IItem[]
): IItem | void => {
	if (!value || !items || items.length === 0) return
	return items.find((item) => item.value === value)
}

/* interface IGetDefaultItem {
	storageKey?: string
	defaultValue?: IItem['value']
	itemsList: IItem[]
}

const getDefaultItem = ({
	storageKey,
	defaultValue,
	itemsList,
}: IGetDefaultItem) => {
	// Get item from local storage
	const storageValue: string | null = storageKey ? getItem(storageKey) : null
	if (
		storageValue &&
		typeof storageValue === 'string' &&
		storageValue !== defaultValue
	) {
		const storageItem = getItemFromValue(storageValue, itemsList)
		if (storageItem) return storageItem
	}

	// Get item from value prop or first item in items list
	return getItemFromValue(defaultValue, itemsList) || itemsList[0]
} */

export default function Dropdown({
	value,
	onChange,
	items,
	storage,
	className,
}: DropdownProps) {
	const [defaultItem, setDefaultItem] = useState<Partial<IItem>>({})
	const [open, setOpen] = useState(false)
	const toggleOpen = () => setOpen((open) => !open)
	const isMounted = useRef(false)

	const handleClick = (item: IItem) => {
		if (onChange) onChange(item.value)
		if (storage) setItem(storage, item.value)
		setDefaultItem(item)
		setOpen(false)
	}

	// On value change update button text and icon
	useEffect(() => {
		// Set default item to dropdown button
		const tempDefaultItem = getItemFromValue(value, items) || items[0]

		if (tempDefaultItem) {
			setDefaultItem(tempDefaultItem)
			if (onChange && tempDefaultItem.value !== value) {
				onChange(tempDefaultItem.value)
			}
		}
	}, [value, items, onChange])

	// On component mount
	useEffect(() => {
		isMounted.current = true
	}, [])

	return (
		<div
			className={classNames(styles.container, className, {
				[styles.open]: open,
			})}
			onBlur={(e) => handleBlur(e, () => setOpen(false))}
		>
			<button className={styles.button} onClick={toggleOpen}>
				{defaultItem.labelIcon && (
					<div className={styles.buttonIcon}>
						<defaultItem.labelIcon />
					</div>
				)}
				<span>{defaultItem.label}</span>
				<ArrowHead className={styles.buttonArrow} />
			</button>

			<div className={styles.content}>
				{items.length > 0 &&
					items.map((item, index) => (
						<button
							className={styles.item}
							onClick={() => handleClick(item)}
							key={index}
						>
							<item.labelIcon />
							{item.label}
						</button>
					))}
			</div>
		</div>
	)
}
