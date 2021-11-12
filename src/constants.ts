import { RawDraftContentState } from 'draft-js'

// import FireVector from '@/public/fire.svg'
import TrophyVector from '@/public/trophy.svg'
import StarVector from '@/public/star.svg'
import ListVector from '@/public/list.svg'
import SquaresVector from '@/public/squares.svg'
import NumberListVector from '@/public/numbered-list.svg'

export const baseUrl = 'https://app.astrano.io'

export const blockchainExplorerUrl = 'https://bscscan.com/token/'

export const marketBaseUrl = 'https://pancakeswap.finance/swap?outputCurrency='

export const metaDefaults = {
	baseUrl,
	image: 'https://i.imgur.com/Bhu0XkA.png',
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
			`${projectName} project information, live price and more  | Astrano`,
	},
	verifyUser: {
		title: 'User verification | Astrano'
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
			label: 'ICO',
			value: 'ico',
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

export const tokenCreationTax = 0.1

export const project = {
	name: {
		minLength: 3,
		// maxLength: 42,
		schema: {
			required: 'Please provide a project name',
			pattern: {
				value: /^[a-zA-Z0-9 !@#$%&()?\-_.,]+$/,
				message:
					'Sorry, only alphanumeric characters, spaces and symbols (!@#$%&()?-_.,) are allowed',
			},
			minLength: {
				value: 3,
				message: 'Project name must be at least 3 characters long',
			},
			maxLength: {
				value: 42,
				message: 'Project name must not exceed 42 characters',
			},
		},
	},
	tags: {
		min: 1,
		max: 10,
		customMaxLength: 16,
		schema: {
			validate: {
				min: (value: string[]) =>
					value.length > 0 || 'Please provide at least 1 project tag',
				max: (value: string[]) =>
					value.length <= 10 || 'A project can at most have 10 tags',
			},
		},
	},
	summary: {
		// maxLength: 160,
		schema: {
			maxLength: {
				value: 160,
				message: 'Project summary must not exceed 160 characters',
			},
		},
	},
	description: {
		minLength: 200,
		maxLength: 3200,
		schema: {
			validate: {
				required: (value: RawDraftContentState) =>
					value?.blocks?.map(({ text }) => text).join('').length >
						0 || 'Please provide a project description',
				minLength: (value: RawDraftContentState) =>
					value.blocks.map(({ text }) => text).join('').length >
						200 ||
					'Project description must be at least 200 characters long',
				maxLength: (value: RawDraftContentState) =>
					value.blocks.map(({ text }) => text).join('').length <
						3200 ||
					'Project description must not exceed 3,200 characters',
			},
		},
	},
	relationship: {
		// maxLength: 400,
		schema: {
			required: 'Please provide a project relationship',
			maxLength: {
				value: 400,
				message: 'Project relationship must not exceed 400 characters',
			},
		},
	},
}

export const token = {
	name: {
		minLength: 3,
		maxLength: 42,
		schema: {
			required: 'Please provide a token name',
			pattern: {
				value: /^[a-zA-Z0-9 ]+$/,
				message:
					'Sorry, only alphanumeric characters and spaces are allowed',
			},
			minLength: {
				value: 3,
				message: 'Token name must be at least 3 characters long',
			},
			maxLength: {
				value: 42,
				message: 'Token name must not exceed 42 characters',
			},
		},
	},
	symbol: {
		minLength: 2,
		maxLength: 5,
		schema: {
			required: 'Please provide a token ticker/symbol',
			pattern: {
				value: /^[a-zA-Z0-9]+$/,
				message: 'Sorry, only alphanumeric characters are allowed',
			},
			minLength: {
				value: 2,
				message:
					'Token ticker/symbol must be at least 2 characters long',
			},
			maxLength: {
				value: 5,
				message: 'Token name must not exceed 5 characters',
			},
		},
	},
	logo: {
		schema: {
			validate: {
				required: (file: File) =>
					Boolean(file?.name) ||
					'Please provide a logo for your project and token',
			},
		},
	},
	totalSupply: {
		min: 100,
		max: 999999999999,
		minLength: 3,
		maxLength: 12,
		default: 21000000,
		schema: {
			required: "Please provide the token's supply",
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			validate: {
				format: (value: string) =>
					Boolean(parseInt(value)) || 'Please provide a valid number',
				min: (value: string) =>
					parseInt(value) >= 100 ||
					'Token supply must be at least 100',
				max: (value: string) =>
					parseInt(value) <= 999999999999 ||
					'Token supply must not exceed 999,999,999,999 (999B)',
			},
		},
	},
	decimals: {
		min: 8,
		max: 21,
		minLength: 1,
		maxLength: 2,
		default: 18,
		schema: {
			required: "Please provide the token's decimals",
			pattern: {
				value: /^[0-9]+$/,
				message: 'Sorry, only numbers are allowed',
			},
			min: {
				value: 8,
				message: 'Token decimals must be at least 8',
			},
			max: {
				value: 21,
				message: 'Token decimals must not exceed 21',
			},
		},
	},
	distributionTax: {
		min: 0,
		max: 5,
		step: 0.1,
		default: 2,
		schema: {
			required: "Please provide the token's distribution tax",
			min: {
				value: 0,
				message: 'Token distribution tax must be a positive number',
			},
			max: {
				value: 5,
				message: 'Token distribution tax must not exceed 5%',
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
