import { useState, useEffect, useRef } from 'react'
import { useRouter, NextRouter } from 'next/router'
import classNames from 'classnames'

import { IProject } from '@/types'
import {
	pagesMetaData,
	sort as sortObject,
	view as viewObject,
} from '@/constants'

import Meta from '@/components/Meta'
import FilterPanel from '@/components/FilterPanel'
import ProjectListing from '@/components/ProjectListing'
import ProjectCard from '@/components/ProjectCard'
import Skeleton from '@/components/Skeleton'
import Modal from '@/components/Modals/Modal'

import { getItem } from '@/helpers/localStorage'
import { useSwr, UseSwrOptions } from '@/utils/fetch'

import CheckVector from '@/public/check.svg'
import styles from '@/styles/index.module.scss'

interface UserVerifiedProps {
	show: boolean
	onClose(): void
}

interface ProjectContainerProps {
	view: string
	projects?: IProject[]
	router: NextRouter
}

const UserVerified = ({ show, onClose }: UserVerifiedProps) => (
	<Modal show={show} onClose={onClose} className={styles.verifiedContainer}>
		<div className={styles.verifiedContent}>
			<div className={styles.verifiedIcon}>
				<CheckVector />
			</div>
			<p className={styles.text}>
				Congratulations! Your account is now verified.
			</p>
			<button className={styles.primaryButton} onClick={onClose}>
				Close
			</button>
		</div>
	</Modal>
)

const ProjectContainer = ({
	view,
	projects,
	router,
}: ProjectContainerProps) => {
	if (!projects) {
		const skeletons = [...new Array(12)].map((_, index) => (
			<Skeleton
				className={
					view === 'card'
						? styles.projectCardSkeleton
						: styles.projectListingSkeleton
				}
				key={index}
			/>
		))
		return <>{skeletons}</>
	}

	if (projects.length === 0)
		return <p className={styles.noProjectsFound}>No projects found</p>

	return (
		<>
			{projects.map((project) => {
				const redirectUrl = `/p/${project.slug}`
				const redirect = () =>
					router.push(redirectUrl, undefined, { shallow: true })

				const props = {
					...project,
					redirectUrl,
					redirect,
					key: project.slug,
				}

				return view === 'card' ? (
					<ProjectCard {...props} />
				) : (
					<ProjectListing {...props} />
				)
			})}
		</>
	)
}

export default function Index() {
	const router = useRouter()
	const [sort, setSort] = useState('')
	const [view, setView] = useState('')
	const [verifiedModal, setVerifiedModal] = useState(false)
	const isMounted = useRef(false)

	const projectFetchUrl = isMounted.current ? `/projects?sort=${sort}` : null
	const projectFetchOptions: UseSwrOptions = { refreshInterval: 120000 }
	const { data: projects } = useSwr(projectFetchUrl, projectFetchOptions)

	useEffect(() => {
		const sortLocalStorage = getItem(sortObject.storage)
		setSort(sortLocalStorage || sortObject.items[0].value)
		const viewLocalStorage = getItem(viewObject.storage)
		setView(viewLocalStorage || viewObject.items[0].value)
		isMounted.current = true
	}, [])

	useEffect(() => {
		if (!router) return
		const query = Object.keys(router.query)
		if (query.includes('verified')) setVerifiedModal(true)
	}, [router])

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
	}

	return (
		<>
			<Meta
				title={pagesMetaData.index.title}
				description={pagesMetaData.index.description}
			/>

			<UserVerified
				show={verifiedModal}
				onClose={() => {
					setVerifiedModal(false)
					router.replace('/', undefined, { shallow: true })
				}}
			/>

			<div className={styles.container}>
				<FilterPanel
					sort={FilterPanelProps.sort}
					view={FilterPanelProps.view}
				/>

				<div
					className={classNames(styles.projectsContainer, {
						[styles.projectCards]: view === 'card',
					})}
				>
					{isMounted.current && (
						<ProjectContainer
							view={view}
							projects={projects}
							router={router}
						/>
					)}
				</div>
			</div>
		</>
	)
}
