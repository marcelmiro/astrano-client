import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { IProject } from '@/types'
import { useSwrImmutable } from '@/utils/fetch'
import { useAuth } from '@/context/Auth.context'
import Modal from '@/components/Modals/Modal'
import SkeletonImage from '@/components/SkeletonImage'
import LoadingSpinner from '@/components/LoadingSpinner'

import CrossVector from '@/public/cross.svg'
import styles from '@/styles/Modals/LikedProjects.module.scss'

interface LikedProject {
	name: IProject['name']
	slug: IProject['slug']
	logoUrl: IProject['logoUrl']
}

interface SwrResponse {
	likedProjects: LikedProject[]
}

interface LikedProjectsProps {
	show: boolean
	onClose(): void
}

interface ContentProps {
	projects: LikedProject[]
	isLoading: boolean
	redirectToProject(slug: string): void
}

const Content = ({ isLoading, projects, redirectToProject }: ContentProps) => {
	if (isLoading) return <LoadingSpinner className={styles.loadingSpinner} />
	if (projects && projects.length > 0) {
		const projectEls = projects.map(({ name, slug, logoUrl }) => (
			<button
				className={styles.project}
				onClick={() => redirectToProject(slug)}
				key={slug}
			>
				<SkeletonImage
					src={logoUrl}
					alt={`${name} logo`}
					className={styles.projectLogo}
				/>
				<p className={styles.projectName}>{name}</p>
			</button>
		))
		return <>{projectEls}</>
	}
	return <p className={styles.noProjects}>No projects liked yet</p>
}

export default function LikedProjects({ show, onClose }: LikedProjectsProps) {
	const Router = useRouter()
	const { logOut } = useAuth()
	const [projects, setProjects] = useState<LikedProject[]>([])
	const isMounted = useRef(false)

	const fetchUrl = show ? '/users/me/liked-projects' : null
	const response = useSwrImmutable<SwrResponse>(fetchUrl, logOut)
	const { data, isValidating, mutate } = response

	// On data change
	useEffect(() => {
		if (!isMounted.current) return
		setProjects(data?.likedProjects || [])
	}, [data])

	// On modal show
	useEffect(() => {
		if (!isMounted.current || !show) return
		mutate()
	}, [show, mutate])

	// On component mount
	useEffect(() => {
		isMounted.current = true
	}, [])

	const redirectToProject = (slug: string) => {
		onClose()
		Router.push(`/p/${slug}`)
	}

	return (
		<Modal
			show={show}
			onClose={onClose}
			className={styles.container}
			centered={false}
		>
			<div className={styles.closeButton} onClick={onClose}>
				<CrossVector />
			</div>

			<h2 className={styles.title}>Liked Projects</h2>

			<div className={styles.projectContainer}>
				<Content
					projects={projects}
					isLoading={isValidating}
					redirectToProject={redirectToProject}
				/>
			</div>
		</Modal>
	)
}
