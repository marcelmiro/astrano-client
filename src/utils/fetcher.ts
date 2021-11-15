import axios, { AxiosRequestConfig } from 'axios'
import { UseFormSetError, Path } from 'react-hook-form'
import useSWRImmutable from 'swr/immutable'
import useSWR, { SWRConfiguration } from 'swr'

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

const swrFetcher = async (url: string) => {
	console.log('Swr fetch: ' + url)
	try {
		// await new Promise((resolve) => setTimeout(resolve, 3000))
		const { data } = await fetchApi.get(url)
		return data
	} catch (e) {
		throw (e as any)?.response || e
	}
}

const swrDefaults: SWRConfiguration = {
	onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
		// Never retry on 401
		if (error.status === 401) return

		// Only retry up to 10 times
		if (retryCount >= 10) return

		// Retry after 5 seconds
		setTimeout(() => revalidate({ retryCount }), 5000)
	},
}

export const useSwr = <T = any, K = any>(url: string | null) => {
	return useSWR<T, K>(url, swrFetcher, swrDefaults)
}

export const useSwrImmutable = <T = any, K = any>(url: string | null) => {
	return useSWRImmutable<T, K>(url, swrFetcher, swrDefaults)
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

const fetcher = async <T>(
	url: string,
	options: AxiosRequestConfig = {}
): Promise<{ data: T; error: null } | { error: FetchError; data: null }> => {
	try {
		console.log('Fetcher: ' + url)
		// await new Promise((resolve) => setTimeout(resolve, 3000))
		const { data } = await fetchApi(url, options)
		return { data, error: null }
	} catch (e) {
		const error: FetchError = {}

		if (axios.isAxiosError(e)) {
			// Delete user object if API response === 401 (invalid user)
			if (e.response?.status === 401) {
				console.log('Invalid user')
				// deleteUser()
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

		if (!error.message && !error.errors) {
			error.message =
				'An unexpected error occurred. Please try again later'
		}

		return { error, data: null }
	}
}

export const parseFormError = <T>(
	error: FetchError,
	setError: UseFormSetError<T>,
	setGeneralError: (message: string) => void,
	paths?: Array<keyof T>
) => {
	const { message, errors } = error

	if (message) setGeneralError(message)

	if (errors) {
		errors.map(({ code, message, path }) => {
			if (paths && paths.includes(path as keyof T)) {
				const error = { type: code, message }
				setError(path as Path<T>, error, { shouldFocus: true })
			} else {
				setGeneralError(message)
			}
		})
	}
}

export default fetcher
