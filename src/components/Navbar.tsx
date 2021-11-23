import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

import { IUser } from '@/types'
import { useAuth } from '@/context/Auth.context'
import { handleBlur } from '@/utils/element'
import Toggle from '@/components/Toggle'
import Skeleton from '@/components/Skeleton'
import LoadingSpinner from '@/components/LoadingSpinner'
import SkeletonImage from '@/components/SkeletonImage'

import AstranoVector from '@/public/astrano.svg'
// import SearchVector from '@/public/search.svg'
import HomeVector from '@/public/home.svg'
import HomeFilledVector from '@/public/home-filled.svg'
import CreateVector from '@/public/create.svg'
import CreateFilledVector from '@/public/create-filled.svg'
import UserVector from '@/public/user.svg'
import LoginVector from '@/public/login.svg'
import HeartVector from '@/public/heart.svg'

import styles from '@/styles/Navbar.module.scss'

interface AvatarProps {
	loading: boolean
	logoUrl?: string
	toggleDropdown(): void
}

const Avatar = ({ loading, logoUrl, toggleDropdown }: AvatarProps) => {
	if (loading) {
		return (
			<div className={styles.userButton}>
				<Skeleton className={styles.userAvatar} />
			</div>
		)
	}

	return (
		<button className={styles.userButton} onClick={toggleDropdown}>
			{logoUrl ? (
				<SkeletonImage
					src={logoUrl}
					alt="User avatar"
					className={styles.userAvatar}
				/>
			) : (
				<UserVector />
			)}
		</button>
	)
}

interface UserDropdownProps {
	show: boolean
	loading: boolean
	user: IUser | null
	logOut(): Promise<void>
	openAuthModal(): void
}

const UserDropdown = ({
	show,
	loading,
	user,
	logOut,
	openAuthModal,
}: UserDropdownProps) => {
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [darkTheme, setDarkTheme] = useState(true)
	const toggleTheme = () => setDarkTheme((prev) => !prev)

	if (loading) return null

	const handleLogOut = async () => {
		if (isLoggingOut) return
		setIsLoggingOut(true)
		await logOut()
		setIsLoggingOut(false)
	}

	return (
		<div
			className={classNames(styles.dropdownContainer, styles.rightAlign, {
				[styles.open]: show,
			})}
			tabIndex={0}
		>
			{user ? (
				<>
					{/* eslint-disable @typescript-eslint/no-empty-function */}
					<button className={styles.dropdownItem} onClick={() => {}}>
						<HeartVector />
						<span>Liked projects</span>
					</button>
					<button
						className={styles.dropdownItem}
						onClick={handleLogOut}
					>
						{isLoggingOut ? (
							<LoadingSpinner />
						) : (
							<LoginVector
								style={{ transform: 'rotate(180deg)' }}
							/>
						)}
						<span>Log out</span>
					</button>
				</>
			) : (
				<button className={styles.dropdownItem} onClick={openAuthModal}>
					<LoginVector />
					<span>Log in / Sign up</span>
				</button>
			)}

			<div className={classNames(styles.dropdownItem, styles.noHover)}>
				<button className={styles.themeButton} onClick={toggleTheme}>
					Dark theme
				</button>
				<Toggle value={darkTheme} onChange={toggleTheme} />
			</div>
		</div>
	)
}

export default function Navbar() {
	const { pathname } = useRouter()
	const { loading, user, logOut: contextLogOut, setShowAuthModal } = useAuth()

	const [showUserDropdown, setShowUserDropdown] = useState(false)
	const toggleUserDropdown = () => setShowUserDropdown((prev) => !prev)

	const openAuthModal = () => {
		setShowUserDropdown(false)
		setShowAuthModal(true)
	}

	const logOut = async () => {
		setShowUserDropdown(false)
		await contextLogOut()
	}

	return (
		<>
			<header className={styles.header}>
				<div className={styles.container}>
					<Link href="/">
						<a className={styles.logo}>
							<AstranoVector className={styles.logoImg} />
							<span className={styles.logoName}>Astrano</span>
						</a>
					</Link>

					{/* <div className={styles.search}>
						<label className={styles.searchLabel}>
							<SearchVector className={styles.searchIcon} />
							<input
								className={styles.searchInput}
								type="text"
								placeholder="Search"
							/>
						</label>
					</div> */}

					<nav className={styles.nav}>
						{pathname === '/' ? (
							<div
								className={classNames(
									styles.navIcon,
									styles.navActive
								)}
							>
								<HomeFilledVector />
							</div>
						) : (
							<Link href="/">
								<a className={styles.navIcon}>
									<HomeVector />
								</a>
							</Link>
						)}

						{pathname === '/p/new' ? (
							<div
								className={classNames(
									styles.navIcon,
									styles.navActive
								)}
							>
								<CreateFilledVector />
							</div>
						) : (
							<Link href="/p/new">
								<a className={styles.navIcon}>
									<CreateVector />
								</a>
							</Link>
						)}

						<div
							className={classNames(
								styles.navIcon,
								styles.userIcon
							)}
							onBlur={(e) =>
								handleBlur(e, () => setShowUserDropdown(false))
							}
						>
							<Avatar
								loading={loading}
								logoUrl={user?.logoUrl}
								toggleDropdown={toggleUserDropdown}
							/>
							<UserDropdown
								show={showUserDropdown}
								loading={loading}
								user={user}
								logOut={logOut}
								openAuthModal={openAuthModal}
							/>
						</div>
					</nav>
				</div>
			</header>
		</>
	)
}
