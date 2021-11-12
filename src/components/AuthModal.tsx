import { useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { AxiosRequestConfig } from 'axios'

import { ILogin, IRegister, IUser } from '@/types'
import {
    login as loginConstants,
    register as registerConstants,
} from '@/constants'
import { useAuth } from '@/context/Auth.context'
import Modal from '@/components/Modal'
import LoadingSpinner from '@/components/LoadingSpinner'
import InputGroup from '@/components/InputGroup'
import ErrorMessage from '@/components/ErrorMessage'
import fetcher, { parseFormError } from '@/utils/fetcher'

import CrossVector from '@/public/cross.svg'
import EyeVector from '@/public/eye.svg'
import EyeDashVector from '@/public/eye-dash.svg'
import CheckVector from '@/public/check.svg'
import styles from '@/styles/AuthModal.module.scss'

interface AuthModalProps {
    show: boolean
    onClose(value?: boolean): void
}

interface LoginContentProps {
    showRegister(): void
    onClose(): void
    setUser(data: IUser | null): void
}

interface RegisterContentProps {
    showLogin(): void
    onClose(): void
    showStatus: boolean
    setShowStatus(value: boolean): void
}

const inputGroupDefaults = {
    containerClassName: styles.inputGroup,
    labelClassName: styles.label,
    errorClassName: styles.error,
}

const VerifyEmail = ({ onClose }: { onClose(): void }) => (
    <div className={styles.successContainer}>
        <div className={styles.successIcon}>
            <CheckVector />
        </div>
        <p className={styles.successText}>
            {
                'Thanks for signing up! We have sent you an email to verify your account details. Please check your spam and junk folders or email us at '
            }
            <Link href="mailto:support@astrano.io">
                <a className={styles.link}>support@astrano.io</a>
            </Link>
            {" if you don't see that email."}
        </p>
        <button className={styles.primaryButton} onClick={onClose}>
            Close
        </button>
    </div>
)

const LoginContent = ({
    showRegister,
    onClose,
    setUser,
}: LoginContentProps) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ILogin>({
        defaultValues: {
            email: 'marcelmiro1@hotmail.com',
            password: 'pass@123',
        },
    })

    const [generalError, setGeneralError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = () => setShowPassword((prev) => !prev)

    const onSubmit = async (formData: ILogin) => {
        const options: AxiosRequestConfig = { method: 'POST', data: formData }
        const { data, error } = await fetcher<IUser>('/auth/login', options)

        if (error) {
            const paths: (keyof ILogin)[] = ['email', 'password']
            parseFormError(error, setError, setGeneralError, paths)
            return
        }
        if (!data) return

        setUser(data)
        setGeneralError('')
        onClose()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h6 className={styles.subTitle}>Welcome back</h6>
            <h4 className={styles.title}>Log into your account</h4>

            <InputGroup
                label="Email"
                id="email"
                error={errors.email?.message}
                {...inputGroupDefaults}
            >
                <input
                    type="text"
                    inputMode="email"
                    {...register('email', loginConstants.email.schema)}
                    placeholder="Email"
                    id="email"
                    className={styles.textbox}
                />
            </InputGroup>

            <InputGroup
                label="Password"
                id="password"
                error={errors.password?.message}
                {...inputGroupDefaults}
            >
                <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', loginConstants.password.schema)}
                    placeholder="Password"
                    id="password"
                    className={styles.passwordInput}
                />
                <button
                    type="button"
                    className={styles.passwordEye}
                    onClick={toggleShowPassword}
                    title="Toggle password visibility"
                >
                    {showPassword ? <EyeVector /> : <EyeDashVector />}
                </button>
            </InputGroup>

            {/* TODO: Forgot password */}
            <button type="button" className={styles.forgotPassword}>
                Forgot password?
            </button>

            <ErrorMessage message={generalError} className={styles.error} />

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.button}
                    onClick={showRegister}
                >
                    Sign up
                </button>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                    {isSubmitting && <LoadingSpinner />}
                    Login
                </button>
            </div>
        </form>
    )
}

const RegisterContent = ({
    showLogin,
    onClose,
    showStatus,
    setShowStatus,
}: RegisterContentProps) => {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<IRegister>()

    const [generalError, setGeneralError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const toggleShowPassword = () => setShowPassword((prev) => !prev)
    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev)
    }

    const onSubmit = async (formData: ILogin) => {
        const options: AxiosRequestConfig = { method: 'POST', data: formData }
        const { data, error } = await fetcher('/auth/signup', options)

        if (error) {
            const paths: (keyof IRegister)[] = [
                'email',
                'username',
                'name',
                'password',
                'passwordConfirmation',
            ]
            parseFormError(error, setError, setGeneralError, paths)
            return
        }
        if (!data) return

        // TODO: Show verification step page
        setShowStatus(true)
        setGeneralError('')
    }

    if (showStatus) return <VerifyEmail onClose={onClose} />

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.04 }}
            style={{ overflow: 'hidden' }}
        >
            <h4 className={styles.title}>Create an account</h4>

            <InputGroup
                label="Email"
                id="email"
                error={errors.email?.message}
                {...inputGroupDefaults}
            >
                <input
                    type="text"
                    inputMode="email"
                    {...register('email', registerConstants.email.schema)}
                    placeholder="Email"
                    id="email"
                    className={styles.textbox}
                />
            </InputGroup>

            <InputGroup
                label="Username"
                id="username"
                error={errors.username?.message}
                {...inputGroupDefaults}
            >
                <input
                    type="text"
                    {...register('username', registerConstants.username.schema)}
                    placeholder="Username"
                    id="username"
                    className={styles.textbox}
                />
            </InputGroup>

            <InputGroup
                label="Full name"
                id="name"
                error={errors.name?.message}
                {...inputGroupDefaults}
            >
                <input
                    type="text"
                    {...register('name', registerConstants.name.schema)}
                    placeholder="Full name"
                    id="name"
                    className={styles.textbox}
                />
            </InputGroup>

            <InputGroup
                label="Password"
                id="password"
                error={errors.password?.message}
                {...inputGroupDefaults}
            >
                <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', registerConstants.password.schema)}
                    placeholder="Password"
                    id="password"
                    className={styles.passwordInput}
                />
                <button
                    type="button"
                    className={styles.passwordEye}
                    onClick={toggleShowPassword}
                    title="Toggle password visibility"
                >
                    {showPassword ? <EyeVector /> : <EyeDashVector />}
                </button>
            </InputGroup>

            <InputGroup
                label="Confirm password"
                id="passwordConfirmation"
                error={errors.passwordConfirmation?.message}
                {...inputGroupDefaults}
            >
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('passwordConfirmation', {
                        ...registerConstants.passwordConfirmation.schema,
                        validate: (value: string) =>
                            value === watch('password') ||
                            'Passwords do not match',
                    })}
                    placeholder="Confirm password"
                    id="passwordConfirmation"
                    className={styles.passwordInput}
                />
                <button
                    type="button"
                    className={styles.passwordEye}
                    onClick={toggleShowConfirmPassword}
                    title="Toggle password visibility"
                >
                    {showConfirmPassword ? <EyeVector /> : <EyeDashVector />}
                </button>
            </InputGroup>

            <ErrorMessage message={generalError} className={styles.error} />

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.button}
                    onClick={showLogin}
                >
                    Login
                </button>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                    {isSubmitting && <LoadingSpinner />}
                    Sign up
                </button>
            </div>
        </motion.form>
    )
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
    const { loading, user, setUser } = useAuth()

    const [showRegister, setShowRegister] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    if (user || loading) return null

    const handleClose = () => onClose(false)

    return (
        <Modal
            show={show}
            onClose={handleClose}
            containerClassName={classNames(styles.container, {
                [styles.registerContainer]: showRegister,
                [styles.statusContainer]: showStatus,
            })}
            onCloseComplete={() => setShowStatus(false)}
        >
            <div className={styles.closeButton} onClick={handleClose}>
                <CrossVector />
            </div>

            {!showRegister ? (
                <LoginContent
                    showRegister={() => setShowRegister(true)}
                    onClose={handleClose}
                    setUser={setUser}
                />
            ) : (
                <RegisterContent
                    showLogin={() => setShowRegister(false)}
                    onClose={handleClose}
                    showStatus={showStatus}
                    setShowStatus={(value: boolean) => setShowStatus(value)}
                />
            )}
        </Modal>
    )
}
