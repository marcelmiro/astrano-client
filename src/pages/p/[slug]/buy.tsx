import { errorData, marketBaseUrl } from '@/constants'
import Error from '@/pages/_error'

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
	const project = projects?.find(
		({ slug: projectSlug }) => projectSlug === slug
	)

	if (!project) return { props: { errorCode: 404 } }
	else if (project.type && project.type.toLowerCase() === 'live') {
		return {
			redirect: {
				permanent: false,
				destination: marketBaseUrl + project.contractAddress,
			},
		}
	} else {
		// return { props: project }
		return { props: { errorCode: 404 } }
	}
}
