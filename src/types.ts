import { RawDraftContentState } from 'draft-js'
import {
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form'

export interface IUser {
	email: string
	username: string
	name: string
	logoUri: string
	likedProjects: string[]
}

export interface ILogin {
	email: string
	password: string
}

export interface IRegister {
	email: string
	username: string
	password: string
	passwordConfirmation: string
}

interface IProjectUser {
	username: string
	logoUri: string
}

interface IProjectToken {
	name: string
	symbol: string
	totalSupply: string
	lockStartIn: string
	lockDuration: string
	tokenAddress: string
	vestingWalletAddress: string
}

interface IProjectCrowdsale {
	rate: string
	cap: string
	individualCap: string
	minPurchaseAmount: string
	goal: string
	openingTime: string
	closingTime: string
	crowdsaleAddress: string
}

interface IProjectLiquidity {
	percentage: number
	rate: string
	lockStartIn: string
	lockDuration: string
}

export interface IProject {
	_id: string
	name: string
	slug: string
	logoUri: string
	user: IProjectUser
	tags: string[]
	description: RawDraftContentState
	// website: string
	// socialUrls: { name: string; url: string }[]
	token: IProjectToken
	crowdsale: IProjectCrowdsale
	liquidity: IProjectLiquidity
	status: 'crowdsale' | 'live'
	likes: number
	updatedAt: Date
	createdAt: Date
}

export interface IUndeployedProject
	extends Omit<IProject, 'token' | 'crowdsale' | 'status' | 'likes'> {
	token: Omit<IProjectToken, 'tokenAddress' | 'vestingWalletAddress'>
	crowdsale: Omit<IProjectCrowdsale, 'crowdsaleAddress'>
}

export interface INewProject {
	name: string
	logo: File
	tags: string[]
	description: RawDraftContentState
	// website: string
	// socialUrls: Array<{ name: string, url: string }>
	tokenName: string
	tokenSymbol: string
	tokenTotalSupply: string
	tokenLockStartIn: string
	tokenLockDuration: string
	crowdsaleRate: string
	crowdsaleCap: string
	crowdsaleIndividualCap: string
	crowdsaleMinPurchaseAmount: string
	crowdsaleGoal: string
	crowdsaleOpeningTime: string
	crowdsaleClosingTime: string
	liquidityPercentage: number
	liquidityRate: string
	liquidityLockStartIn: string
	liquidityLockDuration: string
}

export interface INewProjectStepProps {
	register: UseFormRegister<INewProject>
	errors: FieldErrors
	setValue: UseFormSetValue<INewProject>
	watch: UseFormWatch<INewProject>
	inputGroupDefaults: Record<string, string>
	generalError: string
}
