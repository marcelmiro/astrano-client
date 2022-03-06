import { RawDraftContentState } from 'draft-js'

import { isNumber } from '@/utils/number'
import { Chain } from '@/hooks/useMetamask'

// import FireVector from '@/public/fire.svg'
import TrophyVector from '@/public/trophy.svg'
import StarVector from '@/public/star.svg'
import ListVector from '@/public/list.svg'
import SquaresVector from '@/public/squares.svg'
import NumberListVector from '@/public/numbered-list.svg'

export const RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

export const NETWORK_CONFIG: Chain = {
	chainId: '0x61',
	chainName: 'Binance Smart Chain Testnet',
	nativeCurrency: {
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18,
	},
	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
	blockExplorerUrls: ['https://testnet.bscscan.com'],
}

export const PAIR_TOKEN_CONFIG = {
	name: 'USDT',
	symbol: 'USDT',
	address: '0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684',
}

export const baseUrl = 'https://app.astrano.io'

export const metaDefaults = {
	baseUrl,
	image: 'https://i.imgur.com/Bhu0XkA.png',
	summaryLength: 160,
}

export const pagesMetaData = {
	index: {
		title: 'Astrano | Crypto-investing never made easier',
		description:
			'Revolutionizing investment and funding through the creation of new asset classes.',
	},
	new: {
		title: 'Create a project | Astrano',
		description:
			'Fund your project by creating your own cryptocurrency token.',
	},
	project: {
		title: (projectName: string) =>
			`${projectName} project information, live price, tokenomics and more | Astrano`,
	},
	buyToken: {
		title: (projectName: string, tokenName: string, tokenSymbol: string) =>
			`${projectName} crowdsale. Invest in ${tokenName} (${tokenSymbol}) | Astrano`,
	},
	verifyUser: {
		title: 'User verification | Astrano',
	},
}

interface ErrorDatum {
	message: string
	messageMaxWidth?: string
	metaTitle: string
}
export const errorData: Record<string, ErrorDatum> = {
	404: {
		message:
			'Sorry, the page you’re looking for doesn’t exist. If you think something is broken, report a problem.',
		messageMaxWidth: '28.75rem',
		metaTitle: 'Page not found | Astrano',
	},
	projectNotFound: {
		message:
			'Sorry, the project you’re looking for doesn’t exist. If you think something is broken, report a problem.',
		messageMaxWidth: '29.5rem',
		metaTitle: 'Project not found | Astrano',
	},
	default: {
		message:
			'Sorry, an unexpected error has occurred. If you think something is broken, report a problem.',
		messageMaxWidth: '26rem',
		metaTitle: 'Unexpected error | Astrano',
	},
}

export const login = {
	email: {
		minLength: 3,
		maxLength: 320,
		schema: {
			required: 'Email is required',
			pattern: {
				value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: 'Please enter a valid email address',
			},
		},
	},
	password: {
		minLength: 1,
		maxLength: 512,
		schema: {
			required: 'Password is required',
			minLength: {
				value: 8,
				message:
					'Password is too short - Should be 8 characters minimum',
			},
			maxLength: {
				value: 100,
				message:
					'Password is too long - Should be 100 characters maximum',
			},
		},
	},
}

export const register = {
	email: {
		minLength: 3,
		maxLength: 320,
		schema: {
			required: 'Email is required',
			pattern: {
				value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: 'Please enter a valid email address',
			},
		},
	},
	username: {
		minLength: 3,
		maxLength: 32,
		schema: {
			required: 'Username is required',
			minLength: {
				value: 3,
				message:
					'Username is too short - Should be 3 characters minimum',
			},
			maxLength: {
				value: 32,
				message:
					'Username is too long - Should be 32 characters maximum',
			},
			pattern: {
				value: /^(?!.*[._]{2})(?!.*\.$)(?!\..*$)[a-zA-Z0-9._]+$/,
				message:
					'Sorry, only alphanumeric characters and symbols (._) are allowed',
			},
		},
	},
	name: {
		minLength: 2,
		maxLength: 32,
		schema: {
			required: 'Full name is required',
			minLength: {
				value: 2,
				message:
					'Full name is too short - Should be 2 characters minimum',
			},
			maxLength: {
				value: 32,
				message:
					'Full name is too long - Should be 32 characters maximum',
			},
			pattern: {
				value: /^(?!.*[  ]{2})[a-zA-Z0-9 ]+$/,
				message: 'Sorry, only letters and single spaces are allowed',
			},
		},
	},
	password: {
		minLength: 8,
		maxLength: 100,
		schema: {
			required: 'Password is required',
			minLength: {
				value: 8,
				message:
					'Password is too short - Should be 8 characters minimum',
			},
			maxLength: {
				value: 100,
				message:
					'Password is too long - Should be 100 characters maximum',
			},
			pattern: {
				value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=[\]{}:;"'|\\<>,./?€]).*$/,
				message: 'Please use a mix of letters, numbers and symbols',
			},
		},
	},
	passwordConfirmation: {
		minLength: 8,
		maxLength: 100,
		schema: {
			required: 'Confirm password is required',
		},
	},
}

export const projectTags = [
	{
		label: 'Content creation',
		value: 'content creation',
	},
	{
		label: 'Business',
		value: 'business',
	},
	{
		label: 'Finance',
		value: 'finance',
	},
	{
		label: 'Education',
		value: 'education',
	},
	{
		label: 'Youtube',
		value: 'youtube',
	},
	{
		label: 'Gaming',
		value: 'gaming',
	},
	{
		label: 'Music',
		value: 'music',
	},
	{
		label: 'Sports',
		value: 'sports',
	},
	{
		label: 'Travel',
		value: 'travel',
	},
	{
		label: 'Lifestyle',
		value: 'lifestyle',
	},
	{
		label: 'Science',
		value: 'science',
	},
	{
		label: 'Technology',
		value: 'technology',
	},
	{
		label: 'Nonprofit',
		value: 'nonprofit',
	},
	{
		label: 'Art',
		value: 'art',
	},
	{
		label: 'Clothing',
		value: 'clothing',
	},
	{
		label: 'Real estate',
		value: 'real estate',
	},
]

export const sort = {
	items: [
		/* {
			// Most liked projects in short time (Decay algorithm)
			label: 'Hot',
			labelIcon: FireVector,
			value: 'hot',
		}, */
		{
			// Newest created projects
			label: 'New',
			labelIcon: StarVector,
			value: 'new',
		},
		{
			// Most liked projects of all time
			label: 'Best',
			labelIcon: TrophyVector,
			value: 'best',
		},
	],
	storage: 'index.sort',
}

export const view = {
	items: [
		{
			label: 'List',
			labelIcon: ListVector,
			value: 'list',
		},
		{
			label: 'Card',
			labelIcon: SquaresVector,
			value: 'card',
		},
	],
	storage: 'index.view',
}

/* export const priceFilter = {
	items: [
		{
			label: 'Under $0.01',
			max: 0.01,
		},
		{
			label: '$0.01 to $1',
			min: 0.01,
			max: 1,
		},
		{
			label: '$1 to $10',
			min: 1,
			max: 10,
		},
		{
			label: '$10 to $100',
			min: 10,
			max: 100,
		},
		{
			label: 'Over $100',
			min: 100,
		},
	],
	query: 'price',
}

export const tokenFilter = {
	items: [
		{
			label: 'Live',
			value: 'live',
		},
		{
			label: 'Crowdsale',
			value: 'crowdsale',
		},
		{
			label: 'Private round',
			value: 'private round',
		},
	],
	query: 'token',
}

export const projectFilter = {
	items: projectTags,
	query: 'project',
}

export const otherFilter = {
	items: [
		{
			label: 'Verified only',
			value: 'verified only',
		},
	],
	query: 'other',
} */

export const contractAddressLastCharactersLength = 6

export const tokenCreationTax = 0.04

export const project = {
	name: {
		minLength: 3,
		// maxLength: 42,
		schema: {
			required: 'Project name is required',
			pattern: {
				value: /^[a-zA-Z0-9 !@#$%&()?\-_.,]+$/,
				message:
					'Sorry, only alphanumeric characters, spaces and symbols (!@#$%&()?-_.,) are allowed',
			},
			minLength: {
				value: 3,
				message:
					'Project name is too short - Should be 3 characters minimum',
			},
			maxLength: {
				value: 42,
				message:
					'Project name is too long - Should be 42 characters maximum',
			},
		},
	},
	logo: {
		schema: {
			validate: {
				required: (file: File) =>
					Boolean(file?.name) || 'Project logo is required',
			},
		},
	},
	tags: {
		min: 1,
		max: 5,
		customMaxLength: 16,
		schema: {
			validate: {
				min: (value: string[]) =>
					value.length > 0 || 'Please provide at least 1 project tag',
				max: (value: string[]) =>
					value.length <= 5 || 'A project can at most have 5 tags',
			},
		},
	},
	// TODO: Change min length to 200
	description: {
		minLength: 20,
		maxLength: 8000,
		schema: {
			validate: {
				required: (value: RawDraftContentState) =>
					value?.blocks?.map(({ text }) => text).join('').length >
						0 || 'Project description is required',
				minLength: (value: RawDraftContentState) =>
					value.blocks.map(({ text }) => text).join('').length >=
						20 ||
					'Project description is too short - Should be 20 characters minimum',
				maxLength: (value: RawDraftContentState) =>
					value.blocks.map(({ text }) => text).join('').length <=
						8000 ||
					'Project description is too long - Should be 8000 characters maximum',
			},
		},
	},
}

export const token = {
	name: {
		minLength: 3,
		maxLength: 42,
		schema: {
			required: 'Token name is required',
			/* pattern: {
				value: /^[a-zA-Z0-9 ]+$/,
				message:
					'Sorry, only alphanumeric characters and spaces are allowed',
			}, */
			minLength: {
				value: 3,
				message:
					'Token name is too short - Should be 3 characters minimum',
			},
			maxLength: {
				value: 42,
				message:
					'Token name is too long - Should be 42 characters maximum',
			},
		},
	},
	symbol: {
		minLength: 2,
		maxLength: 5,
		schema: {
			required: 'Ticker/symbol is required',
			pattern: {
				value: /^[a-zA-Z0-9]+$/,
				message: 'Sorry, only alphanumeric characters are allowed',
			},
			minLength: {
				value: 2,
				message:
					'Token ticker/symbol is too short - Should be 2 characters minimum',
			},
			maxLength: {
				value: 5,
				message:
					'Token name is too long - Should be 5 characters maximum',
			},
		},
	},
	totalSupply: {
		min: 100,
		max: 999_999_999_999,
		minLength: 3,
		maxLength: 12,
		default: 21_000_000,
		schema: {
			required: 'Token supply is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			validate: {
				format: (value: string) =>
					isNumber(value) || 'Please provide a valid number',
				min: (value: string) =>
					parseInt(value) >= 100 ||
					'Token supply must be at least 100',
				max: (value: string) =>
					parseInt(value) <= 999999999999 ||
					'Token supply must not exceed 999,999,999,999 (999B)',
			},
		},
	},
	lockStartIn: {
		min: 1,
		max: 3652,
		schema: {
			required: 'Vesting start is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 1,
				message: 'Vesting start must be at least 1 days',
			},
			max: {
				value: 3652,
				message: 'Vesting start must not exceed 3652 days',
			},
		},
	},
	lockDuration: {
		min: 1,
		max: 3652,
		schema: {
			required: 'Vesting duration is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 1,
				message: 'Vesting duration must be at least 1 days',
			},
			max: {
				value: 3652,
				message: 'Vesting duration must not exceed 3652 days',
			},
		},
	},
}

export const crowdsale = {
	rate: {
		min: 1,
		max: 1_000_000,
		maxLength: 7,
		schema: {
			required: 'Rate is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 1,
				message: 'Rate must be at least 1',
			},
			max: {
				value: 1_000_000,
				message: 'Rate must not exceed 1000000 (1M)',
			},
		},
	},
	cap: {
		min: 10,
		max: 999_999_999_999,
		minLength: 2,
		maxLength: 12,
		schema: {
			required: 'Cap is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			validate: {
				format: (value: string) =>
					isNumber(value) || 'Please provide a valid number',
				min: (value: string) =>
					parseInt(value) >= 10 || 'Cap must be at least 10',
				max: (value: string) =>
					parseInt(value) <= 999999999999 ||
					'Cap must not exceed 999,999,999,999 (999B)',
			},
		},
	},
	goal: {
		min: 1,
		max: 999_999_999_999,
		minLength: 1,
		maxLength: 12,
		schema: {
			required: 'Goal is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			validate: {
				format: (value: string) =>
					isNumber(value) || 'Please provide a valid number',
				min: (value: string) =>
					parseInt(value) >= 1 || 'Goal must be at least 1',
				max: (value: string) =>
					parseInt(value) <= 999999999999 ||
					'Goal must not exceed 999,999,999,999 (999B)',
			},
		},
	},
	individualCap: {
		min: 0,
		max: 999_999_999_999,
		minLength: 2,
		maxLength: 12,
		default: 0,
		schema: {
			required: 'Individual cap is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			validate: {
				format: (value: string) =>
					isNumber(value) || 'Please provide a valid number',
				min: (value: string) =>
					parseInt(value) >= 0 ||
					'Individual cap must be a positive number',
				max: (value: string) =>
					parseInt(value) <= 999999999999 ||
					'Individual cap must not exceed 999,999,999,999 (999B)',
			},
		},
	},
	minPurchaseAmount: {
		min: 0,
		max: 100,
		default: 0,
		schema: {
			required: 'Minimum purchase amount is required',
			pattern: {
				value: /^[0-9]+(\.[0-9]+)?$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 0,
				message: 'Minimum purchase amount must be a positive number',
			},
			max: {
				value: 100,
				message: 'Minimum purchase amount must not exceed $100',
			},
		},
	},
	openingTime: {
		schema: {
			validate: {
				futureTime: (value: string) => {
					const date = new Date(value)
					if (!date) return 'Please provide a valid date'
					return (
						date > new Date() ||
						'Opening time must be a time in the future'
					)
				},
				lessThan: (value: string) => {
					const date = new Date(value)
					if (!date) return 'Please provide a valid date'
					const maxTime = new Date(Date.now() + 2678400000) // 31 days
					return (
						date <= maxTime ||
						'Opening time must start before 31 days'
					)
				},
			},
		},
	},
	closingTime: { schema: { validate: {} } },
}

export const liquidity = {
	percentage: {
		min: 50,
		max: 100,
		step: 1,
		default: 75,
		schema: {
			required: 'Liquidity percentage is required',
			min: {
				value: 50,
				message: 'Liquidity percentage must be at least 50%',
			},
			max: {
				value: 100,
				message: 'Liquidity percentage must not exceed 100%',
			},
		},
	},
	rate: {
		min: 1,
		max: 1_000_000,
		maxLength: 7,
		schema: {
			required: 'Rate is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 1,
				message: 'Rate must be at least 1',
			},
			max: {
				value: 1_000_000,
				message: 'Rate must not exceed 1000000 (1M)',
			},
		},
	},
	lockStartIn: {
		min: 1,
		max: 3652,
		schema: {
			required: 'Vesting start is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 1,
				message: 'Vesting start must be at least 1 days',
			},
			max: {
				value: 3652,
				message: 'Vesting start must not exceed 3652 days',
			},
		},
	},
	lockDuration: {
		min: 1,
		max: 3652,
		schema: {
			required: 'Vesting duration is required',
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 1,
				message: 'Vesting duration must be at least 1 days',
			},
			max: {
				value: 3652,
				message: 'Vesting duration must not exceed 3652 days',
			},
		},
	},
}

export const social = {
	website: {
		minLength: 4,
		maxLength: 128,
		schema: {
			required: 'Website is required',
			minLength: {
				value: 4,
				message:
					'Website is too short - Should be 4 characters minimum',
			},
			maxLength: {
				value: 128,
				message:
					'Website is too long - Should be 128 characters maximum',
			},
			pattern: {
				value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
				message: 'Please enter a valid URL',
			},
		},
	},
}

export const editorConstants = {
	inlineControls: [
		{ label: 'B', style: 'BOLD', title: 'Bold' },
		{ label: 'I', style: 'ITALIC', title: 'Italic' },
		{ label: 'U', style: 'UNDERLINE', title: 'Underline' },
	],
	blockControls: [
		{ label: 'H1', style: 'header-one', title: 'Header 1' },
		{ label: 'H2', style: 'header-two', title: 'Header 2' },
		{ label: 'H3', style: 'header-three', title: 'Header 3' },
		{
			icon: ListVector,
			style: 'unordered-list-item',
			title: 'Unordered list',
		},
		{
			icon: NumberListVector,
			style: 'ordered-list-item',
			title: 'Ordered list',
		},
	],
}

export const reportStatuses = ['success', 'error'] as const
export const reportMessageMaxLength = 400

export const chartColors = [
	'#8DA6F2',
	'#6B98F2',
	'#435BF9',
	'#C291F2',
	'#B679F2',
]
