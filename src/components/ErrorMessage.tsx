import ExclamationVector from '@/public/exclamation.svg'

interface ErrorMessageProps {
	message?: string
	className?: string
}

export default function ErrorMessage({
	message,
	className,
}: ErrorMessageProps) {
	if (!message) return null

	return (
		<div className={className}>
			<ExclamationVector />
			<span role="alert">{message}</span>
		</div>
	)
}
