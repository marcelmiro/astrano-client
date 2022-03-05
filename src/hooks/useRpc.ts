import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'

import { RPC_URL } from '@/constants'

export default function useRpc() {
	const [provider, setProvider] = useState<JsonRpcProvider>()

	useEffect(() => {
		try {
			setProvider(new ethers.providers.JsonRpcProvider(RPC_URL))
		} catch (e) {}
	}, [])

	return { provider }
}
