import { useState, useEffect } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
import classNames from 'classnames'
import { AxiosRequestConfig } from 'axios'

import { NewForm as IForm } from '@/types'
import { pagesMetaData, token as tokenConstants } from '@/constants'

import Meta from '@/components/Meta'
import ProjectStep from '@/components/NewForm/ProjectStep'
import TokenStep from '@/components/NewForm/TokenStep'
import SuccessStep from '@/components/NewForm/SuccessStep'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/context/Auth.context'
import fetch, { parseFormError } from '@/utils/fetch'

import styles from '@/styles/new.module.scss'
import stepStyles from '@/styles/FormStep.module.scss'

const { new: MetaData } = pagesMetaData

interface Step {
	name: string
	fields: (keyof IForm)[]
}

const steps: Step[] = [
	{
		name: 'Project',
		fields: ['name', 'tags', 'summary', 'description', 'relationship'],
	},
	{
		name: 'Token',
		fields: [
			'tokenName',
			'tokenSymbol',
			'logo',
			'tokenSupply',
			'tokenDecimals',
			'tokenDistributionTax',
		],
	},
]

const defaultValues: Partial<IForm> = {
	tags: [],
	tokenSupply: tokenConstants.totalSupply.default.toString(),
	tokenDecimals: tokenConstants.decimals.default,
	tokenDistributionTax: tokenConstants.distributionTax.default,
}

const inputGroupDefaults = {
	containerClassName: stepStyles.inputGroup,
	labelClassName: stepStyles.label,
	descriptionClassName: stepStyles.description,
	errorClassName: stepStyles.error,
}

const isStepValid = (activeStep: number, errors: FieldErrors) => {
	if (!steps[activeStep]) return false
	if (!errors || Object.keys(errors).length === 0) return true
	const stepFields = steps[activeStep].fields
	const stepErrors = stepFields.filter((field) => errors[field])
	return stepErrors.length === 0
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

export default function New() {
	const { user, logOut, setShowAuthModal } = useAuth()
	const [activeStep, setActiveStep] = useState(0)
	const isLastStep = activeStep === steps.length - 1
	const [generalError, setGeneralError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

	const {
		register,
		handleSubmit,
		trigger,
		watch,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<IForm>({ defaultValues, mode: 'onChange' })

	// On step change
	useEffect(() => window.scrollTo(0, 0), [activeStep])

	// On component mount check if user logged in
	useEffect(() => {
		if (!user) setShowAuthModal(true)
	}, [user, setShowAuthModal])

	if (isSubmitSuccessful) {
		return (
			<>
				<DefaultRender />
				<SuccessStep />
			</>
		)
	}

	const submitProject = handleSubmit(async (data: IForm) => {
		const formData = new FormData()
		const { logo, ...restData } = data
		formData.append('data', JSON.stringify(restData))
		formData.append('logo', logo)

		const fetchParams: AxiosRequestConfig = {
			method: 'POST',
			data: formData,
			headers: { 'content-type': 'multipart/form-data' },
		}

		const { data: _data, error } = await fetch(
			'/projects',
			fetchParams,
			logOut
		)
		console.log({ data: _data, error })

		if (error) {
			const fields = steps.map(({ fields }) => fields).flat()
			parseFormError(error, setError, setGeneralError, fields)

			const errorFields = Object.keys(errors)
			for (let i = 0; i < steps.length; i++) {
				if (steps[i].fields.some((r) => errorFields.indexOf(r) > -1)) {
					return setActiveStep(i)
				}
			}
			return
		}

		setIsSubmitSuccessful(true)
	})

	const handleNextStep = async () => {
		if (!user) return setShowAuthModal(true)
		if (isLastStep) return submitProject()
		if (!steps[activeStep]) return setActiveStep(0)
		const isStepValid = await trigger(steps[activeStep].fields)
		if (isStepValid) setActiveStep((prevStep) => prevStep + 1)
	}

	const handlePreviousStep = () => setActiveStep((prevStep) => prevStep - 1)

	const defaultStepProps = {
		register,
		errors,
		setValue,
		watch,
		inputGroupDefaults,
		generalError,
	}

	const renderActiveStep = () => {
		if (activeStep === 0) return <ProjectStep {...defaultStepProps} />
		if (activeStep === 1) return <TokenStep {...defaultStepProps} />
		setActiveStep(0)
	}

	return (
		<>
			<DefaultRender />

			<div className={styles.container}>
				<h1 className={styles.title}>Create a project</h1>
				<h2 className={styles.subtitle}>
					Fund your project by creating your own cryptocurrency token.
					Fields with a default value are not required to be filled
					in.
				</h2>

				<StepStatus activeStep={activeStep} />

				{renderActiveStep()}

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
			</div>
		</>
	)
}
