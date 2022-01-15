import { useState, useEffect } from 'react'

interface TimeUnit {
	label: string
	value: number
}

type UseCountdown = (endDate: Date) => TimeUnit[] | null

const calculateTimeLeft = (endDate: Date): TimeUnit[] | null => {
	const date = endDate ? new Date(endDate) : null
	if (!date) return null

	const difference = +date - +new Date()
	if (difference <= 0) return null

	const timeLeft = [
		{
			label: 'days',
			value: Math.floor(difference / (1000 * 60 * 60 * 24)),
		},
		{
			label: 'hours',
			value: Math.floor((difference / (1000 * 60 * 60)) % 24),
		},
		{
			label: 'minutes',
			value: Math.floor((difference / 1000 / 60) % 60),
		},
		{
			label: 'seconds',
			value: Math.floor((difference / 1000) % 60),
		},
	]

	const processedTimeLeft: { label: string; value: number }[] = []

	let breakFlag = true
	timeLeft.forEach((interval) => {
		if (breakFlag && !interval.value) return
		breakFlag = false
		processedTimeLeft.push(interval)
	})

	return processedTimeLeft
}

const useCountdown: UseCountdown = (endDate) => {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate))

	useEffect(() => {
		const timer = setTimeout(
			() => setTimeLeft(calculateTimeLeft(endDate)),
			1000
		)
		return () => clearTimeout(timer)
	})

	return timeLeft
}

export default useCountdown
