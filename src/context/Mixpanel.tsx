import { createContext, useContext, useEffect, useCallback } from 'react'
import mixpanel from 'mixpanel-browser'

interface MixpanelContextProps {
	track(event: string): void
}

/* eslint-disable @typescript-eslint/no-empty-function */
const defaultValues: MixpanelContextProps = {
	track: () => {},
}
/* eslint-enable @typescript-eslint/no-empty-function */

const MixpanelContext = createContext<MixpanelContextProps>(defaultValues)

export const useMixpanel = () => useContext(MixpanelContext)

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		mixpanel.init('1577b3c7725ded0261dff52611cb0a87')
	}, [])

	const _track = useCallback((event: string) => mixpanel.track(event), [])

	const value = {
		track: _track,
	}

	return (
		<MixpanelContext.Provider value={value}>
			{children}
		</MixpanelContext.Provider>
	)
}
