module.exports = {
	reactStrictMode: true,
	poweredByHeader: false,

	// TODO: Remove on next.js v12.1 as will become default
	swcMinify: true,

	images: {
		formats: ['image/avif', 'image/webp'],
		domains: ['cdn.astrano.io', 's2.coinmarketcap.com', 'i.imgur.com'],
	},

	webpack(config) {
		/* const rules = config.module.rules
			.find((rule) => typeof rule.oneOf === 'object')
			.oneOf.filter((rule) => Array.isArray(rule.use))

		rules.forEach((rule) => {
			rule.use.forEach((moduleLoader) => {
				if (
					moduleLoader.loader.includes('css-loader') &&
					!moduleLoader.loader.includes('postcss-loader')
				) {
					delete moduleLoader.options.modules.getLocalIdent
					moduleLoader.options = {
						...moduleLoader.options,
						modules: {
							...moduleLoader.options.modules,
							localIdentName:
								process.env.NODE_ENV === 'production'
									? '[sha1:hash:hex:6]'
									: '[name]_[local]__[hash:base64:5]',
							// Add other css-loader options here
						},
					}
				}
			})
		}) */

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

		return config
	},
}
