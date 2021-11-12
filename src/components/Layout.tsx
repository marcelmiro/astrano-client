import { pagesMetaData } from '@/constants'
import { useAuth } from '@/context/Auth.context'
import Meta from '@/components/Meta'
import Navbar from '@/components/Navbar'
import AuthModal from '@/components/AuthModal'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { showAuthModal, setShowAuthModal } = useAuth()
	return (
		<div className="wrapper">
			<Meta
				title={pagesMetaData.index.title}
				description={pagesMetaData.index.description}
			/>
			<Navbar />
			<AuthModal show={showAuthModal} onClose={setShowAuthModal} />
			{children}
		</div>
	)
}
