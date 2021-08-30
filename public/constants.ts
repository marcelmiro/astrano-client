import FireVector from '../public/fire.svg'
import TrophyVector from '../public/trophy.svg'
import StarVector from '../public/star.svg'
import ListVector from '../public/list.svg'
import SquaresVector from '../public/squares.svg'

export const sort = {
	items: [
		{
			// Most liked tokens in short time (Decay algorithm)
			label: 'Hot',
			labelIcon: FireVector,
			value: 'hot',
		},
		{
			// Most liked tokens of all time
			label: 'Best',
			labelIcon: TrophyVector,
			value: 'best',
		},
		{
			// Newest created tokens
			label: 'New',
			labelIcon: StarVector,
			value: 'new',
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

export const priceFilter = {
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
	items: [
		{
			label: 'Content creator',
			value: 'content creator',
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
	],
	query: 'project',
}

/* export const otherFilter = {
	items: [
		{
			label: 'Verified only',
			value: 'verified only',
		},
	],
	query: 'other',
} */
