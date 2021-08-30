import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

import BorderGradient from './BorderGradient'
import AstranoVector from '../../public/astrano.svg'
import SearchVector from '../../public/search.svg'
import HomeVector from '../../public/home.svg'
import HomeFilledVector from '../../public/home-filled.svg'
import CreateVector from '../../public/create.svg'
import CreateFilledVector from '../../public/create-filled.svg'
import UserVector from '../../public/user.svg'

import styles from '../styles/Navbar.module.scss'

export default function Navbar() {
	const { pathname } = useRouter()

	return (
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
					<BorderGradient className={styles.searchBorder} />
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
					{pathname === '/create' ? (
						<div
							className={classNames(
								styles.navIcon,
								styles.navActive
							)}
						>
							<CreateFilledVector />
						</div>
					) : (
						<Link href="/">
							<a className={styles.navIcon}>
								<CreateVector />
							</a>
						</Link>
					)}
					<Link href="/">
						<a className={styles.navIcon}>
							<UserVector />
						</a>
					</Link>
				</nav>
			</div>
		</header>
	)
}
