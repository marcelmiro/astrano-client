import { useState, useCallback } from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'

import {
	login as loginConstants,
	register as registerConstants,
} from '@/constants'
import Modal from '@/components/Modal'

import CrossVector from '@/public/cross.svg'
import EyeVector from '@/public/eye.svg'
import EyeDashVector from '@/public/eye-dash.svg'
import styles from '@/styles/AuthModal.module.scss'

interface AuthModalProps {
	show: boolean
	onClose(): void
}

interface ILogin {
	email: string
	password: string
}

interface IRegister {
	email: string
	username: string
	firstName: string
	lastName: string
	password: string
	confirmPassword: string
}

interface LoginContentProps {
	login: Partial<ILogin>
	updateLogin(newProps: Partial<ILogin>): void
	showRegister(): void
}
interface RegisterContentProps {
	register: Partial<IRegister>
	updateRegister(newProps: Partial<IRegister>): void
	showLogin(): void
}

const LoginContent = ({
	showRegister,
	login,
	updateLogin,
}: LoginContentProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const toggleShowPassword = () => setShowPassword((prev) => !prev)

	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateLogin({ email: value })
	}
	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateLogin({ password: value })
	}

	return (
		<>
			<h6 className={styles.subTitle}>Welcome back</h6>
			<h4 className={styles.title}>Log into your account</h4>

			<div className={styles.inputGroup}>
				<label htmlFor="email" className={styles.label}>
					Email
				</label>
				<input
					type="email"
					value={login.email || ''}
					onChange={onEmailChange}
					minLength={loginConstants.email.minLength}
					maxLength={loginConstants.email.maxLength}
					placeholder="Email"
					id="email"
					className={styles.input}
				/>
			</div>

			<div className={styles.inputGroup}>
				<div className={styles.labelContainer}>
					<label htmlFor="password" className={styles.label}>
						Password
					</label>
					{/* <button className={styles.labelButton}>
						Forgot password?
					</button> */}
				</div>
				<input
					type={showPassword ? 'text' : 'password'}
					value={login.password || ''}
					onChange={onPasswordChange}
					minLength={loginConstants.password.minLength}
					maxLength={loginConstants.password.maxLength}
					placeholder="Password"
					id="password"
					className={styles.passwordInput}
				/>
				<button
					className={styles.passwordEye}
					onClick={toggleShowPassword}
					title="Toggle password visibility"
				>
					{showPassword ? <EyeVector /> : <EyeDashVector />}
				</button>
			</div>

			<div className={styles.actions}>
				<button className={styles.button} onClick={showRegister}>
					Sign up
				</button>
				<button className={styles.primaryButton}>Login</button>
			</div>

			<p className={styles.notRegistered}>
				Not registered yet?{' '}
				<button onClick={showRegister}>Register</button>
			</p>
		</>
	)
}

const RegisterContent = ({
	register,
	updateRegister,
	showLogin,
}: RegisterContentProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const toggleShowPassword = () => setShowPassword((prev) => !prev)
	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev)
	}

	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateRegister({ email: value })
	}
	const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateRegister({ username: value })
	}
	const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateRegister({ firstName: value })
	}
	const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateRegister({ lastName: value })
	}
	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		updateRegister({ password: value })
	}
	const onConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value
		updateRegister({ confirmPassword: value })
	}

	return (
		<motion.div
			initial={{ height: 0 }}
			animate={{ height: 'auto' }}
			transition={{ duration: 0.04 }}
			style={{ overflow: 'hidden' }}
		>
			<h6 className={styles.subTitle}>
				Already have an account?{' '}
				<button onClick={showLogin}>Sign in</button>
			</h6>
			<h4 className={styles.title}>Create an account</h4>

			<div className={styles.inputGroup}>
				<label htmlFor="email" className={styles.label}>
					Email
				</label>
				<input
					type="email"
					value={register.email || ''}
					onChange={onEmailChange}
					minLength={registerConstants.email.minLength}
					maxLength={registerConstants.email.maxLength}
					placeholder="Email"
					id="email"
					className={styles.input}
				/>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor="username" className={styles.label}>
					Username
				</label>
				<input
					type="text"
					value={register.username || ''}
					onChange={onUsernameChange}
					minLength={registerConstants.username.minLength}
					maxLength={registerConstants.username.maxLength}
					placeholder="Username"
					id="username"
					className={styles.input}
				/>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor="firstName" className={styles.label}>
					First name
				</label>
				<input
					type="text"
					value={register.firstName || ''}
					onChange={onFirstNameChange}
					minLength={registerConstants.firstName.minLength}
					maxLength={registerConstants.firstName.maxLength}
					placeholder="First name"
					id="firstName"
					className={styles.input}
				/>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor="lastName" className={styles.label}>
					Last name
				</label>
				<input
					type="text"
					value={register.lastName || ''}
					onChange={onLastNameChange}
					minLength={registerConstants.lastName.minLength}
					maxLength={registerConstants.lastName.maxLength}
					placeholder="Last name"
					id="lastName"
					className={styles.input}
				/>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor="password" className={styles.label}>
					Password
				</label>
				<input
					type={showPassword ? 'text' : 'password'}
					value={register.password || ''}
					onChange={onPasswordChange}
					minLength={registerConstants.password.minLength}
					maxLength={registerConstants.password.maxLength}
					placeholder="Password"
					id="password"
					className={styles.passwordInput}
				/>
				<button
					className={styles.passwordEye}
					onClick={toggleShowPassword}
					title="Toggle password visibility"
				>
					{showPassword ? <EyeVector /> : <EyeDashVector />}
				</button>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor="confirmPassword" className={styles.label}>
					Confirm password
				</label>
				<input
					type={showConfirmPassword ? 'text' : 'password'}
					value={register.confirmPassword || ''}
					onChange={onConfirmPasswordChange}
					minLength={registerConstants.password.minLength}
					maxLength={registerConstants.password.maxLength}
					placeholder="Confirm password"
					id="confirmPassword"
					className={styles.passwordInput}
				/>
				<button
					className={styles.passwordEye}
					onClick={toggleShowConfirmPassword}
					title="Toggle password visibility"
				>
					{showConfirmPassword ? <EyeVector /> : <EyeDashVector />}
				</button>
			</div>

			<div className={styles.actions}>
				<button className={styles.button} onClick={showLogin}>
					Login
				</button>
				<button className={styles.primaryButton}>Sign up</button>
			</div>
		</motion.div>
	)
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
	const [showRegister, setShowRegister] = useState(false)
	const [login, setLogin] = useState<Partial<ILogin>>({})
	const [register, setRegister] = useState<Partial<IRegister>>({})

	const updateLogin = useCallback((newProps: Partial<ILogin>) => {
		setLogin((prevState) => ({ ...prevState, ...newProps }))
	}, [])

	const updateRegister = useCallback((newProps: Partial<IRegister>) => {
		setRegister((prevState) => ({ ...prevState, ...newProps }))
	}, [])

	const resetStates = () => {
		setShowRegister(false)
		setLogin({})
		setRegister({})
	}

	return (
		<Modal
			show={show}
			onClose={onClose}
			containerClassName={classNames(styles.container, {
				[styles.registerContainer]: showRegister,
			})}
			onCloseComplete={resetStates}
		>
			<div className={styles.closeButton} onClick={onClose}>
				<CrossVector />
			</div>

			{!showRegister ? (
				<LoginContent
					login={login}
					updateLogin={updateLogin}
					showRegister={() => setShowRegister(true)}
				/>
			) : (
				<RegisterContent
					register={register}
					updateRegister={updateRegister}
					showLogin={() => setShowRegister(false)}
				/>
			)}
		</Modal>
	)
}
