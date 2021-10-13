import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

import { handleBlur } from '@/utils/element'
// import Toggle from '@/components/Toggle'
import AuthModal from '@/components/AuthModal'

import AstranoVector from '@/public/astrano.svg'
import SearchVector from '@/public/search.svg'
import HomeVector from '@/public/home.svg'
import HomeFilledVector from '@/public/home-filled.svg'
import CreateVector from '@/public/create.svg'
import CreateFilledVector from '@/public/create-filled.svg'
import UserVector from '@/public/user.svg'
import LoginVector from '@/public/login.svg'

import styles from '@/styles/Navbar.module.scss'

export default function Navbar() {
	const { pathname } = useRouter()
	const [showUserDropdown, setShowUserDropdown] = useState(false)
	const [showAuthModal, setShowAuthModal] = useState(false)

	const toggleUserDropdown = () => {
		setShowUserDropdown((prev) => !prev)
	}

	const openAuthModal = () => {
		setShowUserDropdown(false)
		setShowAuthModal(true)
	}

	// const [darkTheme, setDarkTheme] = useState(true)
	// const toggleDarkTheme = () => setDarkTheme((prev) => !prev)

	return (
		<>
			<AuthModal
				show={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>

			<header className={styles.header}>
				<div className={styles.container}>
					<Link href="/">
						<a className={styles.logo}>
							<AstranoVector className={styles.logoImg} />
							<span className={styles.logoName}>Astrano</span>
						</a>
					</Link>

					<div className={styles.search}>
						<label className={styles.searchLabel}>
							<SearchVector className={styles.searchIcon} />
							<input
								className={styles.searchInput}
								type="text"
								placeholder="Search"
							/>
						</label>
					</div>

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
							<button
								className={styles.userButton}
								onClick={toggleUserDropdown}
							>
								<UserVector />
							</button>
							<div
								className={classNames(
									styles.dropdownContainer,
									styles.rightAlign,
									{ [styles.open]: showUserDropdown }
								)}
							>
								<button
									className={styles.dropdownItem}
									onClick={openAuthModal}
								>
									<LoginVector />
									<span>Log in / Sign up</span>
								</button>

								{/* <div
								className={classNames(
									styles.dropdownItem,
									styles.noHover
								)}
							>
								<button
									className={styles.themeButton}
									onClick={toggleDarkTheme}
								>
									Dark theme
								</button>
								<Toggle
									value={darkTheme}
									onChange={() =>
										setDarkTheme((prev) => !prev)
									}
								/>
							</div> */}
							</div>
						</div>
					</nav>
				</div>
			</header>
		</>
	)
}
