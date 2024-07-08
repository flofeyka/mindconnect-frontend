'use client'

import { makeStore } from '@lib/redux/store'
import { MantineProvider } from '@mantine/core'
import { NextUIProvider } from '@nextui-org/react'
import { Provider } from 'react-redux'

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<Provider store={makeStore()}>
			<MantineProvider>
				<NextUIProvider>{children}</NextUIProvider>
			</MantineProvider>
		</Provider>
	)
}

export default Providers
