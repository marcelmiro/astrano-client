import { errorData, marketBaseUrl } from '@/constants'
import Error from '@/pages/_error'

import { IProject } from '@/types'
import fetcher from '@/utils/fetcher'
import projects from '@/public/projects.json'

const { projectNotFound } = errorData

interface BuyProjectProps {
	errorCode?: number
}

export default function BuyProject({ errorCode }: BuyProjectProps) {
	if (errorCode) {
		return (
			<Error
				statusCode={errorCode}
				{...(errorCode === 404 ? projectNotFound : {})}
			/>
		)
	}

	return null
}

export async function getServerSideProps({
	params,
}: {
	params: { slug: string }
}) {
	const { slug } = params

	const { data: project, error } = await fetcher<IProject>(
		'/projects/' + slug
	)

	if (error || !project) {
		const errorCode = (error as any).status || 500
		return { props: { errorCode } }
	}

	if (project.status?.name === 'live') {
		return {
			redirect: {
				permanent: false,
				destination: marketBaseUrl + project.token.contractAddress,
			},
		}
	}

	// return { props: project }
	return { props: { errorCode: 404 } }
}
