import { RawDraftContentState } from 'draft-js'

export interface IUser {
	email: string
	username: string
	name: string
	logoUrl: string
	likedProjects: string[]
}

export interface ILogin {
	email: string
	password: string
}

export interface IRegister {
	email: string
	username: string
	name: string
	password: string
	passwordConfirmation: string
}

interface IProjectUser {
	username: string
	logoUrl: string
}

interface IProjectToken {
	name: string
	symbol: string
	totalSupply: string
	decimals: number
	distributionTax: number
	contractAddress: string
	blockchainExplorerUrl: string
	marketUrl?: string
	price: string
}

interface IProjectStatus {
	// name: ['live', 'ico']
	name: string
	startsAt?: Date
	endsAt?: Date
}

export interface IProject {
	_id: string
	name: string
	slug: string
	logoUrl: string
	user: IProjectUser
	tags: string[]
	description: RawDraftContentState
	relationship?: string
	token: IProjectToken
	status: IProjectStatus
	website: string
	socialUrls: { name: string; url: string }[]
	likes: number
	updatedAt: Date
	createdAt: Date
}

export interface NewForm {
	name: string
	tags: string[]
	description: RawDraftContentState
	relationship: string
	tokenName: string
	tokenSymbol: string
	logo: File
	tokenSupply: string
	tokenDecimals: number
	tokenDistributionTax: number
	website: string
	socialUrls: Array<{ name: string, url: string }>
}
