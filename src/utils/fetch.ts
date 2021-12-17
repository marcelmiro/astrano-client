import axios, { AxiosRequestConfig } from 'axios'
import { UseFormSetError, Path } from 'react-hook-form'
import useSWRImmutable from 'swr/immutable'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/*$/, '')

const _timeout = process.env.NEXT_PUBLIC_API_TIMEOUT
const timeout = (_timeout && parseInt(_timeout)) || 10 * 1000

const csrfCookie = process.env.NEXT_PUBLIC_CSRF_COOKIE

const fetchApi = axios.create({
	baseURL,
	timeout,
	withCredentials: true,
	xsrfCookieName: csrfCookie,
})

const swrFetch = async (url: string, onLogout?: () => void) => {
	console.log('Swr fetch: ' + url)
	try {
		const { data } = await fetchApi.get(url)
		return data
	} catch (e) {
		// Check response status === 401 (invalid user) and run onLogout if exists
		if (onLogout && axios.isAxiosError(e) && e.response?.status === 401) {
			try {
				onLogout()
			} catch (e) {}
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		throw (e as any)?.response || e
	}
}

const swrDefaults: SWRConfiguration = {
	onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
		// Never retry on 401 or 404
		if (error.status === 401 || error.status === 404) return

		// Only retry up to 10 times
		if (retryCount >= 10) return

		// Retry after 5 seconds
		setTimeout(() => revalidate({ retryCount }), 5000)
	},
}

export interface UseSwrOptions extends SWRConfiguration {
	onLogout?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseSwr = <T = any, K = any>(
	url: string | null,
	options: UseSwrOptions
) => SWRResponse<T, K>

export const useSwr: UseSwr = (url, options = {}) => {
	const { onLogout, ...swrOptions } = options
	const useSwrOptions = { ...swrDefaults, ...swrOptions }
	return useSWR(url, (url) => swrFetch(url, onLogout), useSwrOptions)
}

export const useSwrImmutable: UseSwr = (url, options = {}) => {
	const { onLogout, ...swrOptions } = options
	const useSwrOptions = { ...swrDefaults, ...swrOptions }
	return useSWRImmutable(url, (url) => swrFetch(url, onLogout), useSwrOptions)
}

interface FetchError {
	status?: number
	type?: string
	message?: string
	errors?: Array<{
		code: string
		message: string
		path: string
	}>
}

type Fetch = <T>(
	url: string,
	options?: AxiosRequestConfig,
	onLogout?: () => void
) => Promise<{ data: T; error: null } | { error: FetchError; data: null }>

const fetch: Fetch = async (url, options = {}, onLogout) => {
	try {
		console.log('Fetch: ' + url)
		const { data } = await fetchApi(url, options)
		return { data, error: null }
	} catch (e) {
		const error: FetchError = {}

		if (axios.isAxiosError(e)) {
			// Call onLogout if API response === 401 (invalid user)
			if (e.response?.status === 401 && onLogout) {
				try {
					onLogout()
				} catch (e) {}
			}

			error.status = e.response?.status

			const data = e.response?.data
			if (data) {
				const { message, type, code, errors } = data
				error.type = type || code
				error.message = message
				error.errors = errors
			}
		}

		if (!error.message && !error.errors)
			error.message = 'An unexpected error occurred. Please try again later'

		return { error, data: null }
	}
}

export interface FetchAndParseParams<K> {
	fetchOptions: AxiosRequestConfig & { url: string; onLogout?: () => void }
	setError: UseFormSetError<K>
	setGeneralError: (message: string) => void
	paths: Array<keyof K>
	onError?: (errors: Record<string, string>) => void
}

const show401ErrorExceptions = ['/auth/login']

// Generic type K defaults to any to prevent errors from UseFormSetError as it uses literal string union type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchAndParse = async <T, K = any>({
	fetchOptions,
	setError,
	setGeneralError,
	paths,
	onError,
}: FetchAndParseParams<K>): Promise<T | null> => {
	const { url, onLogout, ...restFetchOptions } = fetchOptions

	const { data, error } = await fetch<T>(url, restFetchOptions, onLogout)

	// Parse error if exists
	if (error) {
		let generalError = ''
		const { status, message, errors } = error

		// Set general error if message exists and error is not a 401 error
		if (message && (status !== 401 || show401ErrorExceptions.includes(url)))
			generalError = message

		// Set field errors
		const tempErrors: Record<string, string> = {}

		if (errors) {
			errors.map(({ code, message, path }) => {
				if (paths.includes(path as keyof K)) {
					const error = { type: code, message }
					setError(path as Path<K>, error, { shouldFocus: true })
					tempErrors[path] = message
				} else if (!generalError) {
					generalError = message
				}
			})
		}

		setGeneralError(generalError)

		onError?.(tempErrors)
	}

	return data
}

export default fetch
