// import FireVector from '@/public/fire.svg'
import TrophyVector from '@/public/trophy.svg'
import StarVector from '@/public/star.svg'
import ListVector from '@/public/list.svg'
import SquaresVector from '@/public/squares.svg'
import NumberListVector from '@/public/numbered-list.svg'

export const baseUrl = 'https://app.astrano.io'

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
	},
	password: {
		minLength: 1,
		maxLength: 512,
	},
}

export const register = {
	email: {
		minLength: 3,
		maxLength: 320,
	},
	username: {
		minLength: 2,
		maxLength: 32,
	},
	firstName: {
		minLength: 2,
		maxLength: 32,
	},
	lastName: {
		minLength: 2,
		maxLength: 32,
	},
	password: {
		minLength: 10,
		maxLength: 512,
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

export const token = {
	name: {
		minLength: 3,
		maxLength: 42,
	},
	symbol: {
		minLength: 2,
		maxLength: 5,
	},
	totalSupply: {
		min: 1,
		max: 999999999999,
		minLength: 1,
		maxLength: 12,
		default: 21000000,
	},
	decimals: {
		min: 8,
		max: 21,
		minLength: 1,
		maxLength: 2,
		default: 18,
	},
	distributionTax: {
		min: 0,
		max: 5,
		default: 2,
	},
}

export const project = {
	name: {
		minLength: 3,
		maxLength: 42,
	},
	tags: {
		min: 1,
		max: 10,
		customMaxLength: 16,
	},
	summary: {
		maxLength: 400,
	},
	description: {
		minLength: 200,
		maxLength: 3200,
	},
	relationship: {
		maxLength: 400,
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
