import { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

import { AuthProvider } from '@/context/Auth.context'
import { MixpanelProvider } from '@/context/Mixpanel'
import Layout from '@/components/Layout'

import '@/styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<MixpanelProvider>
			<AuthProvider>
				<Layout>
					<NextNProgress
						height={3}
						showOnShallow={true}
						options={{ showSpinner: false }}
					/>
					<Component {...pageProps} />
				</Layout>
			</AuthProvider>
		</MixpanelProvider>
	)
}

/* MyApp.getInitialProps = async (appContext: AppContext) => {
	// calls page's `getInitialProps` and fills `appProps.pageProps`
	const appProps = await App.getInitialProps(appContext)

	const response = await fetchApi('/users/me').catch(() => {})
	const user = response?.data || null

	return { ...appProps, user }
} */

export default MyApp
