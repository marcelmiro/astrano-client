import { RawDraftContentState } from 'draft-js'

export interface Project {
	id: number
	name: string
	slug: string
	symbol: string
	totalSupply: string
	decimals: number
	distributionTax: number
	logoUrl: string
	contractAddress: string
	blockchainExplorerLink: string
	type: string
	icoEndDate?: string
	author: string
	authorAvatarUrl: string
	tags: string[]
	likes: number
	price: string
	summary: string
	description: RawDraftContentState
	projectRelationship: string
	website: string
	socialUrls: { name: string; link: string }[]
	marketUrl?: string
	updatedAt: string
	createdAt: string
}
