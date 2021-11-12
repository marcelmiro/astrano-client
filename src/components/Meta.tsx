import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { metaDefaults } from '@/constants'

interface MetaProps {
	title: string
	description?: string
	canonical?: string
	image?: string
	hideSeo?: boolean
	children?: React.ReactNode
}

export default function Meta({
	title,
	description,
	canonical,
	image,
	hideSeo,
	children,
}: MetaProps) {
	const router = useRouter()

	const processedCanonical = canonical || metaDefaults.baseUrl + router.asPath
	const processedImage = image || metaDefaults.image

	return (
		<Head>
			{/* Main meta */}
			<title>{title}</title>
			{description && <meta name="description" content={description} />}

			{/* OpenGraph meta */}
			<meta property="og:type" content="website" />
			<meta name="og:title" property="og:title" content={title} />
			{description && (
				<meta
					name="og:description"
					property="og:description"
					content={description}
				/>
			)}
			<meta property="og:site_name" content="Astrano" />
			<meta property="og:url" content={processedCanonical} />
			<meta property="og:image" content={processedImage} />

			{/* Twitter meta */}
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:title" content={title} />
			{description && (
				<meta name="twitter:description" content={description} />
			)}
			<meta name="twitter:site" content="@AstranoCrypto" />
			<meta name="twitter:creator" content="@AstranoCrypto" />
			<meta name="twitter:image" content={processedImage} />

			{/* Favicon */}
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/favicons/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicons/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicons/favicon-16x16.png"
			/>
			<link rel="manifest" href="/favicons/site.webmanifest" />
			<link
				rel="mask-icon"
				href="/favicons/safari-pinned-tab.svg"
				color="#c27ff9"
			/>
			<link rel="shortcut icon" href="/favicons/favicon.ico" />
			<meta name="msapplication-TileColor" content="#0f0e13" />
			<meta
				name="msapplication-config"
				content="/favicons/browserconfig.xml"
			/>
			<meta name="theme-color" content="#0f0e13" />

			{/* Other */}
			<link rel="canonical" href={processedCanonical} />
			{hideSeo && <meta name="robots" content="noindex nofollow" />}
			{children}
		</Head>
	)
}
