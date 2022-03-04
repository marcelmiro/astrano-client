export const address = '0x48775b027aAd8DA1955795D3c816E799c89de88f'

export const abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'crowdsale',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'vestingWallet',
				type: 'address',
			},
		],
		name: 'ProjectCreated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'pairTokenAmount',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'liquidityPair',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liquidityAmount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'remainingTokenAmount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'remainingPairTokenAmount',
				type: 'uint256',
			},
		],
		name: 'ProjectFinalized',
		type: 'event',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'string',
						name: 'tokenName',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'tokenSymbol',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'tokenTotalSupply',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'tokenLockStartIn',
						type: 'uint64',
					},
					{
						internalType: 'uint64',
						name: 'tokenLockDuration',
						type: 'uint64',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleRate',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleCap',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleIndividualCap',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleMinPurchaseAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleGoal',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'crowdsaleOpeningTime',
						type: 'uint64',
					},
					{
						internalType: 'uint64',
						name: 'crowdsaleClosingTime',
						type: 'uint64',
					},
					{
						internalType: 'uint256',
						name: 'liquidityRate',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'liquidityLockStartIn',
						type: 'uint64',
					},
					{
						internalType: 'uint64',
						name: 'liquidityLockDuration',
						type: 'uint64',
					},
					{
						internalType: 'uint256',
						name: 'liquidityPercentage',
						type: 'uint256',
					},
				],
				internalType: 'struct ProjectFactory.NewProject',
				name: 'data_',
				type: 'tuple',
			},
		],
		name: 'createProject',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'creationFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token_',
				type: 'address',
			},
		],
		name: 'finalizeProject',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token_',
				type: 'address',
			},
		],
		name: 'project',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'creator',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'pairToken',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'crowdsale',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'vestingWallet',
						type: 'address',
					},
					{
						internalType: 'uint64',
						name: 'tokenLockStartIn',
						type: 'uint64',
					},
					{
						internalType: 'uint64',
						name: 'tokenLockDuration',
						type: 'uint64',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleRate',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleCap',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'crowdsaleGoal',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'liquidityRate',
						type: 'uint256',
					},
					{
						internalType: 'uint64',
						name: 'liquidityLockStartIn',
						type: 'uint64',
					},
					{
						internalType: 'uint64',
						name: 'liquidityLockDuration',
						type: 'uint64',
					},
					{
						internalType: 'uint8',
						name: 'liquidityPercentage',
						type: 'uint8',
					},
					{
						internalType: 'bool',
						name: 'finalized',
						type: 'bool',
					},
				],
				internalType: 'struct ProjectFactory.Project',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'router',
		outputs: [
			{
				internalType: 'contract IUniswapV2Router02',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'tokenFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]
