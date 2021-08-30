import { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

import Navbar from '../components/Navbar'
import FilterPanel from '../components/FilterPanel'
import TokenList from '../components/TokenList'
import TokenCard from '../components/TokenCard'

import {
	sort as sortObject,
	view as viewObject,
	priceFilter as priceFilterObject,
	tokenFilter as tokenFilterObject,
	projectFilter as projectFilterObject,
	// otherFilter as otherFilterObject
} from '../../public/constants'
import tokens from '../../public/tokens.json'

import styles from '../styles/index.module.scss'

interface IPriceFilter {
	min?: number
	max?: number
}

export default function Home() {
	const [sort, setSort] = useState('')
	const [view, setView] = useState('')
	const [priceFilter, setPriceFilter] = useState<IPriceFilter>({})
	const [tokenFilter, setTokenFilter] = useState<string[]>([])
	const [projectFilter, setProjectFilter] = useState<string[]>([])
	// const [otherFilter, setOtherFilter] = useState<string[]>([])
	const isMounted = useRef(false)

	/* useEffect(() => {
		if (!isMounted.current) return
		console.log('New sort mode: ' + sort)
	}, [sort])
	useEffect(() => {
		if (!isMounted.current) return
		console.log('New view mode: ' + view)
	}, [view]) */
	/* useEffect(() => {
		if (!isMounted.current) return
		console.log(tokenFilter)
	}, [tokenFilter]) */
	useEffect(() => {
		// if (!isMounted.current) return
		console.log(priceFilter)
	}, [priceFilter])
	useEffect(() => { isMounted.current = true }, [])

	const FilterPanelProps = {
		sort: {
			value: sort,
			setter: setSort,
			items: sortObject.items,
			storage: sortObject.storage,
		},
		view: {
			value: view,
			setter: setView,
			items: viewObject.items,
			storage: viewObject.storage,
		},
		priceFilter: {
			title: 'Price',
			setter: setPriceFilter,
			items: priceFilterObject.items,
			query: priceFilterObject.query,
		},
		tokenFilter: {
			title: 'Token',
			setter: setTokenFilter,
			items: tokenFilterObject.items,
			query: tokenFilterObject.query,
		},
		projectFilter: {
			title: 'Project',
			setter: setProjectFilter,
			items: projectFilterObject.items,
			query: projectFilterObject.query,
		},
		/* otherFilter: {
			title: 'Other',
			setter: setOtherFilter,
			items: otherFilterObject.items,
			query: otherFilterObject.query
		} */
	}

	return (
		<div className={styles.wrapper}>
			<Navbar />
			<div className={styles.container}>
				<FilterPanel
					sort={FilterPanelProps.sort}
					view={FilterPanelProps.view}
					priceFilter={FilterPanelProps.priceFilter}
					tokenFilter={FilterPanelProps.tokenFilter}
					projectFilter={FilterPanelProps.projectFilter}
					// otherFilter={FilterPanelProps.otherFilter}
				/>

				<div
					className={classNames(styles.tokensContainer, {
						[styles.tokenCards]: view === 'card',
					})}
				>
					{tokens &&
						(view === 'card'
							? tokens.map((token) => (
									<TokenCard {...token} key={token.id} />
							  ))
							: tokens.map((token) => (
									<TokenList {...token} key={token.id} />
							  )))}
				</div>
			</div>
		</div>
	)
}
