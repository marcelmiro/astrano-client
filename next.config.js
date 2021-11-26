const relative = require('path').relative
const loaderUtils = require('loader-utils')

// Based on https://tinyurl.com/next-config-js
function getCssModuleLocalIdent(context, _, exportName, options) {
	const relativePath = relative(
		context.rootContext,
		context.resourcePath
	).replace(/\\+/g, '/')

	const buffer = Buffer.from(
		`filePath:${relativePath}#className:${exportName}`
	)

	const hash = loaderUtils.getHashDigest(buffer, 'md5', 'base64', 6)

	return loaderUtils
		.interpolateName(context, hash, options)
		.replace(/\.module_/, '_')
		.replace(/[^a-zA-Z0-9-_]/g, '_')
		.replace(/^(\d|--|-\d)/, '__$1')
}

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	swcMinify: true, // TODO: Remove after next js v12.1 as will become default
	images: {
		formats: ['image/avif', 'image/webp'],
		domains: ['cdn.astrano.io'],
	},
	webpack(config, { dev }) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						svgoConfig: {
							plugins: [
								{
									cleanupIDs: false,
									prefixIds: false,
								},
							],
						},
					},
				},
			],
		})

		if (!dev) {
			const rules = config.module.rules
				.find((rule) => typeof rule.oneOf === 'object')
				.oneOf.filter((rule) => Array.isArray(rule.use))

			rules.forEach((rule) => {
				rule.use.forEach((moduleLoader) => {
					if (
						moduleLoader.loader?.includes('css-loader') &&
						!moduleLoader.loader.includes('postcss-loader')
					) {
						moduleLoader.options.modules.getLocalIdent =
							getCssModuleLocalIdent
					}
				})
			})
		}

		return config
	},
}

module.exports = nextConfig
