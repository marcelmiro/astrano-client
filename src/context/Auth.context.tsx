import {
	useState,
	createContext,
	useContext,
	useEffect,
	useRef,
	useCallback,
} from 'react'

import { IUser } from '@/types'
import fetch, { useSwrImmutable } from '@/utils/fetch'

interface AuthContextProps {
	loading: boolean
	user: IUser | null
	setUser(data: AuthContextProps['user']): void
	logOut(): Promise<void>
	showAuthModal: boolean
	setShowAuthModal(value: boolean): void
}

const defaultValues: AuthContextProps = {
	loading: true,
	user: null,
	setUser: () => {},
	logOut: async () => {},
	showAuthModal: false,
	setShowAuthModal: () => {},
}

const AuthContext = createContext<AuthContextProps>(defaultValues)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState<AuthContextProps['user']>(null)
	const [showAuthModal, setShowAuthModal] = useState(false)
	const isMounted = useRef(false)

	const { data, error } = useSwrImmutable<IUser>('/users/me')

	useEffect(() => {
		if (!isMounted.current) return
		if (loading) setLoading(false)
		setUser(data || null)
	}, [data, error])

	useEffect(() => {
		isMounted.current = true
	}, [])

	const _setUser = useCallback(
		(data: AuthContextProps['user']) => setUser(data),
		[]
	)

	const logOut = useCallback(async () => {
		const { error } = await fetch('/auth/logOut', { method: 'POST' })
		if (!error) setUser(null)
	}, [])

	const _setShowAuthModal = useCallback(
		(value: boolean) => setShowAuthModal(value),
		[]
	)

	const value = {
		loading,
		user,
		showAuthModal,
		setUser: _setUser,
		logOut,
		setShowAuthModal: _setShowAuthModal,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
