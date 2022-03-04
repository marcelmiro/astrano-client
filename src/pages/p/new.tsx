import { useState, useEffect, useRef } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
// import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import classNames from 'classnames'

import { INewProject, INewProjectStepProps, IUndeployedProject } from '@/types'
import {
	pagesMetaData,
	token as tokenConstants,
	crowdsale as crowdsaleConstants,
	liquidity as liquidityConstants,
} from '@/constants'
import { useAuth } from '@/context/Auth.context'
import fetch, { fetchAndParse, FetchAndParseParams } from '@/utils/fetch'

import Meta from '@/components/Meta'
import ProjectStep from '@/components/NewProjectForm/ProjectStep'
import TokenStep from '@/components/NewProjectForm/TokenStep'
import CrowdsaleStep from '@/components/NewProjectForm/CrowdsaleStep'
import LiquidityStep from '@/components/NewProjectForm/LiquidityStep'
import SuccessStep from '@/components/NewProjectForm/SuccessStep'
import LoadingSpinner from '@/components/LoadingSpinner'

import styles from '@/styles/new.module.scss'
import stepStyles from '@/styles/FormStep.module.scss'
import DeployStep from '@/components/NewProjectForm/DeployStep'
import { useMixpanel } from '@/context/Mixpanel'

const { new: MetaData } = pagesMetaData

interface Step {
	name: string
	fields: (keyof INewProject)[]
	disabled?: boolean
}

const steps: Step[] = [
	{
		name: 'Project',
		fields: ['name', 'logo', 'tags', 'description'],
	},
	// Include social in project?
	/* {
		name: 'Social',
		fields: ['website', 'socialUrls'],
	}, */
	{
		name: 'Token',
		fields: [
			'tokenName',
			'tokenSymbol',
			'tokenTotalSupply',
			'tokenLockStartIn',
			'tokenLockDuration',
		],
	},
	{
		name: 'Crowdsale',
		fields: [
			'crowdsaleRate',
			'crowdsaleCap',
			'crowdsaleIndividualCap',
			'crowdsaleMinPurchaseAmount',
			'crowdsaleGoal',
			'crowdsaleOpeningTime',
			'crowdsaleClosingTime',
		],
	},
	{
		name: 'Liquidity',
		fields: [
			'liquidityPercentage',
			'liquidityRate',
			'liquidityLockStartIn',
			'liquidityLockDuration',
		],
	},
	{
		name: 'Deploy',
		fields: [],
		disabled: true,
	},
]

const stepFields = steps.map(({ fields }) => fields).flat()

const defaultValues: Partial<INewProject> = {
	tags: [],
	tokenTotalSupply: tokenConstants.totalSupply.default.toString(),
	crowdsaleIndividualCap: crowdsaleConstants.individualCap.default.toString(),
	crowdsaleMinPurchaseAmount:
		crowdsaleConstants.minPurchaseAmount.default.toString(),
	liquidityPercentage: liquidityConstants.percentage.default,
}

const inputGroupDefaults = {
	containerClassName: stepStyles.inputGroup,
	labelClassName: stepStyles.label,
	errorClassName: stepStyles.error,
}

const isStepValid = (activeStep: number, errors: FieldErrors) => {
	if (!steps[activeStep]) return false
	if (!errors || Object.keys(errors).length === 0) return true
	const stepFields = steps[activeStep].fields
	const stepErrors = stepFields.filter((field) => errors[field])
	return stepErrors.length === 0
}

// Redirect to minimum step number on list of errors
const redirectStepOnError = (
	errors: Record<string, string>,
	redirect: (step: number) => void
) => {
	let stepRedirect = -1

	const errorFields = Object.keys(errors)

	for (let i = 0; i < steps.length; i++) {
		if (
			steps[i].fields.some((field) => errorFields.indexOf(field) > -1) &&
			(stepRedirect > i || stepRedirect === -1)
		)
			stepRedirect = i
	}

	if (stepRedirect >= 0) redirect(stepRedirect)
}

const DefaultRender = () => (
	<Meta title={MetaData.title} description={MetaData.description} />
)

const StepStatus = ({ activeStep }: { activeStep: number }) => (
	<div className={styles.statusContainer}>
		{steps.map(({ name }, index) => (
			<div
				className={classNames(styles.stepStatus, {
					[styles.active]: activeStep === index,
				})}
				key={index}
			>
				<div className={styles.statusIcon}>{index + 1}</div>
				<div className={styles.statusTitle}>{name}</div>
			</div>
		))}
	</div>
)

const SubmitButtonContent = () => (
	<div className={styles.submitButtonContent}>
		<LoadingSpinner className={styles.loading} />
		<span>Submitting...</span>
	</div>
)

export default function New({
	undeployedProject,
}: {
	undeployedProject: IUndeployedProject
}) {
	const { track } = useMixpanel()
	const { user, logOut, setShowAuthModal } = useAuth()
	const [project, setProject] = useState<IUndeployedProject | null>(
		undeployedProject
	)
	const [activeStep, setActiveStep] = useState(undeployedProject ? 4 : 0)
	const isLastStep = activeStep === steps.length - 1
	const [generalError, setGeneralError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
	const [tx, setTx] = useState('')
	const isMounted = useRef(false)

	const {
		register,
		handleSubmit,
		trigger,
		watch,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<INewProject>({ defaultValues, mode: 'onChange' })

	const defaultStepProps: INewProjectStepProps = {
		register,
		errors,
		setValue,
		watch,
		inputGroupDefaults,
		generalError,
	}

	// On step change
	useEffect(() => window.scrollTo(0, 0), [activeStep])

	// On component mount check if user logged in
	useEffect(() => {
		let isSubscribed = true
		if (!user) {
			setShowAuthModal(true)
			if (isMounted.current) setProject(null)
		}
		if (user && !project) {
			fetch<IUndeployedProject>('/projects/deploy').then(({ data }) => {
				if (!isSubscribed) return
				setProject(data)
			})
		}

		return () => {
			isSubscribed = false
		}
	}, [user, project, setShowAuthModal])

	useEffect(() => {
		if (project && activeStep !== 4) setActiveStep(4)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project])

	useEffect(() => {
		isMounted.current = true
	}, [])

	if (isSubmitSuccessful) {
		return (
			<>
				<DefaultRender />
				<SuccessStep tx={tx} />
			</>
		)
	}

	const submitProject = async () => {
		track('CreateProject')
		const isValid = await trigger(steps.map((step) => step.fields).flat())
		if (!isValid)
			return redirectStepOnError(
				errors as Record<string, string>,
				setActiveStep
			)

		handleSubmit(async (data: INewProject) => {
			// FIXME Test fetchAndParseOptions onError as its never been tested
			const formData = new FormData()
			const { logo, ...restData } = data
			formData.append('data', JSON.stringify(restData))
			formData.append('logo', logo)

			const fetchAndParseOptions: FetchAndParseParams<INewProject> = {
				setError,
				setGeneralError,
				fetchOptions: {
					url: '/projects',
					method: 'POST',
					headers: { 'content-type': 'multipart/form-data' },
					data: formData,
					onLogout: logOut,
				},
				paths: stepFields,
				onError: (errors) => redirectStepOnError(errors, setActiveStep),
			}

			const fetchData = await fetchAndParse<IUndeployedProject>(
				fetchAndParseOptions
			)

			if (fetchData) {
				setProject(fetchData)
				setActiveStep((prevStep) => prevStep + 1)
			}
		})()
	}

	const handleNextStep = async () => {
		if (!user) return setShowAuthModal(true)
		if (Object.keys(errors).length === 0) {
			if (isLastStep || steps[activeStep + 1].disabled)
				return await submitProject()
			const isStepValid = await trigger(steps[activeStep].fields)
			if (isStepValid) return setActiveStep((prevStep) => prevStep + 1)
		}
		redirectStepOnError(errors as Record<string, string>, setActiveStep)
	}

	const handlePreviousStep = () => setActiveStep((prevStep) => prevStep - 1)

	const renderActiveStep = () => {
		if (project)
			return (
				<DeployStep
					project={project}
					setTx={setTx}
					deploySuccessful={() => setIsSubmitSuccessful(true)}
					cancelProject={() => Router.reload()}
				/>
			)

		if (activeStep === 0) return <ProjectStep {...defaultStepProps} />
		if (activeStep === 1) return <TokenStep {...defaultStepProps} />
		if (activeStep === 2) return <CrowdsaleStep {...defaultStepProps} />
		if (activeStep === 3) return <LiquidityStep {...defaultStepProps} />
		setActiveStep(0)
	}

	return (
		<>
			<DefaultRender />

			<div className={styles.container}>
				<h1 className={styles.title}>Create a project</h1>
				<h2 className={styles.subtitle}>
					Fund your project by creating your own cryptocurrency token.
					For more information visit our documentation site by
					clicking
					<Link href="https://docs.astrano.io/">
						<a target="_blank" rel="noopener noreferrer">
							here
						</a>
					</Link>
					.
				</h2>

				<StepStatus activeStep={activeStep} />

				{renderActiveStep()}

				{!steps[activeStep].disabled && (
					<div className={styles.stepActions}>
						{activeStep > 0 && (
							<button
								type="button"
								className={styles.stepButton}
								onClick={handlePreviousStep}
							>
								Back
							</button>
						)}
						<button
							type="button"
							className={styles.stepPrimaryButton}
							onClick={handleNextStep}
							disabled={!isStepValid(activeStep, errors)}
						>
							{isSubmitting ? (
								<SubmitButtonContent />
							) : isLastStep ? (
								'Create project'
							) : (
								'Next'
							)}
						</button>
					</div>
				)}
			</div>
		</>
	)
}

/* export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const options: Record<string, unknown> = {}
	if (ctx.req) options.headers = { cookie: ctx.req.headers.cookie }
	const { data } = await fetch('/projects/deploy', options)
	return data ? { props: { undeployedProject: data } } : { props: {} }
} */
