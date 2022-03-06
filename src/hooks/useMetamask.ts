import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

import { NETWORK_CONFIG } from '@/constants'

export interface Chain {
	chainId: string // A 0x-prefixed hexadecimal string
	chainName: string
	nativeCurrency: {
		name: string
		symbol: string // 2-6 characters long
		decimals: 18
	}
	rpcUrls: string[]
	blockExplorerUrls: string[]
}

export enum MetamaskStatus {
	NOT_INSTALLED = 'not_installed',
	NOT_CONNECTED = 'not_connected',
	WRONG_NETWORK = 'wrong_network',
	CONNECTED = 'connected',
}

const useMetamask = () => {
	const [status, setStatus] = useState<MetamaskStatus>()
	const [provider, _setProvider] = useState<Web3Provider>()
	const [account, setAccount] = useState('')
	const [chainId, setChainId] = useState('')

	const setProvider = () => {
		const provider = new ethers.providers.Web3Provider(
			window.ethereum,
			'any'
		)
		_setProvider(provider)
		return provider
	}

	const getProvider = useCallback(() => {
		if (provider) return provider
		if (window?.ethereum) return setProvider()
	}, [provider])

	const connectMetamask = async () => {
		const provider = getProvider()
		if (!provider) return alert('Metamask extension not found')
		try {
			const accounts = await provider.send('eth_requestAccounts', [])
			setAccount(accounts[0])
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((e as any).code === -32002) {
				alert(
					'Please open your Metamask extension to complete the transaction.'
				)
			} else {
				throw e
			}
		}
	}

	const changeNetwork = async (chain: Chain) => {
		const provider = getProvider()
		if (!provider) return alert('Metamask extension not found')
		try {
			const params = [{ chainId: chain.chainId }]
			await provider.send('wallet_switchEthereumChain', params)
		} catch (_e) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const e = _e as any
			if (e.code === 4902) {
				await provider.send('wallet_addEthereumChain', [chain])
			} else if (e.code === -32002) {
				alert(
					'Please open your Metamask extension to complete the transaction.'
				)
			} else {
				throw e
			}
		}
	}

	useEffect(() => {
		const provider = getProvider()
		if (!provider) return
		let isSubscribed = true

		Promise.all([
			provider.send('eth_accounts', []),
			provider.send('eth_chainId', []),
		]).then(([accounts, chainId]) => {
			if (!isSubscribed) return
			setAccount(accounts[0])
			setChainId(chainId)
		})

		window.ethereum.on('chainChanged', (chainId: string) => {
			setChainId(chainId)
		})

		window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
			setAccount(newAccounts[0])
		})

		return () => {
			isSubscribed = false
		}
	}, [getProvider])

	useEffect(() => {
		if (!chainId) setStatus(MetamaskStatus.NOT_INSTALLED)
		else if (!account) setStatus(MetamaskStatus.NOT_CONNECTED)
		else if (chainId === NETWORK_CONFIG.chainId)
			setStatus(MetamaskStatus.CONNECTED)
		else setStatus(MetamaskStatus.WRONG_NETWORK)
	}, [chainId, account])

	useEffect(() => {
		if (!window?.ethereum) return
		setProvider()
	}, [])

	return {
		getProvider,
		status,
		account,
		chainId,
		connectMetamask,
		changeNetwork,
	}
}

export default useMetamask
