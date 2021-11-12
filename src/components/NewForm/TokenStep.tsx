import { useState, useEffect, useRef } from 'react'
import {
	UseFormRegister,
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form'
import classNames from 'classnames'

import { NewForm as IForm } from '@/types'
import { token as tokenConstants, tokenCreationTax } from '@/constants'
import {
	addThousandSeparator,
	expToNumber,
	safeMultiplication,
} from '@/utils/number'
import InputGroup from '@/components/InputGroup'
import SkeletonImage from '@/components/SkeletonImage'

import UploadVector from '@/public/upload.svg'
import ArrowHead from '@/public/arrowhead.svg'
import styles from '@/styles/FormStep.module.scss'

interface TokenStepProps {
	register: UseFormRegister<IForm>
	errors: FieldErrors
	setValue: UseFormSetValue<IForm>
	watch: UseFormWatch<IForm>
	inputGroupDefaults: Record<string, string>
}

const generateImageBlob = (file: File): string => {
	if (!file) return ''
	try {
		return URL.createObjectURL(file) || ''
	} catch (e) {
		return ''
	}
}

export default function TokenStep({
	register,
	errors,
	setValue,
	watch,
	inputGroupDefaults,
}: TokenStepProps) {
	const [showAdvanced, setShowAdvanced] = useState(false)
	const toggleAdvanced = () => setShowAdvanced((prevState) => !prevState)
	const [logoPreview, setLogoPreview] = useState('')
	const [totalSupply, setTotalSupply] = useState('')
	const [receivedSupply, setReceivedSupply] = useState('')
	const logoRef = useRef<HTMLInputElement>(null)
	const distributionValueRef = useRef<HTMLSpanElement>(null)
	const distributionSliderRef = useRef<HTMLInputElement | null>(null)
	const [logo, distributionTax] = watch(['tokenLogo', 'tokenDistributionTax'])

	const registerDistributionTax = register('tokenDistributionTax', {
		valueAsNumber: true,
		...tokenConstants.distributionTax.schema,
	})

	const onSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.value = e.target.value?.toUpperCase() || ''
	}

	const onLogoClick = () => logoRef?.current?.click()

	const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file?.name) return
		setValue('tokenLogo', file, { shouldValidate: true })
		setLogoPreview(generateImageBlob(file))
	}

	const onSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value?.split('.')[0].replace(/\D/g, '')
		setValue('tokenSupply', value, { shouldValidate: true })
		setTotalSupply(value)
	}

	useEffect(() => {
		const numericSupply = parseInt(totalSupply)
		if (
			!numericSupply ||
			totalSupply.length > tokenConstants.totalSupply.maxLength
		) {
			return setReceivedSupply('0')
		}
		const receivedSupply =
			!!numericSupply &&
			safeMultiplication(numericSupply, 1 - tokenCreationTax)
		const processedReceivedSupply = receivedSupply
			? expToNumber(receivedSupply) || ''
			: totalSupply
		setReceivedSupply(processedReceivedSupply)
	}, [totalSupply])

	useEffect(() => {
		const input = distributionSliderRef?.current
		const valueEl = distributionValueRef?.current
		if (!input || !valueEl) return

		const thumbSize = 20
		const value = parseFloat(input.value)
		const max = parseFloat(input.max)
		const min = parseFloat(input.min)
		if (
			(!value && value !== 0) ||
			(!max && max !== 0) ||
			(!min && min !== 0)
		) {
			return
		}

		const position = ((value - min) / (max - min)) * input.clientWidth
		const offset =
			Math.round((thumbSize * position) / input.clientWidth) -
			thumbSize / 2 +
			valueEl.clientWidth / 2
		valueEl.style.left = position - offset + 'px'
	}, [distributionTax, showAdvanced])

	useEffect(() => {
		register('tokenLogo', tokenConstants.logo.schema)
		register('tokenSupply', tokenConstants.totalSupply.schema)
	}, [register])

	useEffect(() => {
		setLogoPreview(generateImageBlob(logo))
		setTotalSupply(watch('tokenSupply') || '')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<h2 className={styles.title}>Token details</h2>

			<InputGroup
				label="Name"
				description="This is the token name that will be deployed to the token's blockchain."
				id="tokenName"
				error={errors.tokenName?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('tokenName', tokenConstants.name.schema)}
					type="text"
					minLength={tokenConstants.name.minLength}
					// maxLength={tokenConstants.name.maxLength}
					placeholder="Name"
					id="name"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Ticker/Symbol"
				id="tokenSymbol"
				error={errors.tokenSymbol?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('tokenSymbol', {
						onChange: onSymbolChange,
						...tokenConstants.symbol.schema,
					})}
					type="text"
					minLength={tokenConstants.symbol.minLength}
					// maxLength={tokenConstants.symbol.maxLength}
					placeholder="Ticker/Symbol"
					id="tokenSymbol"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Logo"
				description="Choose the image to upload."
				id="tokenLogo"
				error={errors.tokenLogo?.message}
				{...inputGroupDefaults}
			>
				<input
					type="file"
					accept="image/png, image/svg+xml, image/jpeg, image/webp"
					id="tokenLogo"
					onChange={onLogoChange}
					ref={logoRef}
				/>
				<div
					className={classNames(styles.fileInput, {
						[styles.selectedFile]: logo?.name,
					})}
				>
					{logo?.name ? (
						<div className={styles.selectedFileContent}>
							{logoPreview && (
								<SkeletonImage
									src={logoPreview}
									alt="Token logo preview"
									className={styles.filePreview}
								/>
							)}
							<div
								className={
									styles.selectedFileContentSecondColumn
								}
							>
								<p>{logo.name}</p>
								<button onClick={onLogoClick}>
									Change logo
								</button>
							</div>
						</div>
					) : (
						<div
							className={styles.fileInputContent}
							onClick={onLogoClick}
						>
							<UploadVector />
							PNG, JPEG, WEBP or SVG. Max 1Mb.
						</div>
					)}
				</div>
			</InputGroup>

			<button
				className={classNames(styles.toggleButton, {
					[styles.open]: showAdvanced,
				})}
				onClick={toggleAdvanced}
			>
				<ArrowHead />
				Advanced settings
			</button>

			<div className={classNames({ [styles.hide]: !showAdvanced })}>
				<InputGroup
					label="Total supply"
					description={`Total number of tokens to create. This number cannot be changed in the future and new tokens cannot be minted. The default and recommended value to use is 21,000,000. Astrano will keep ${
						tokenCreationTax * 100
					}% of the tokens created.`}
					id="tokenSupply"
					error={errors.tokenSupply?.message}
					{...inputGroupDefaults}
				>
					<input
						type="text"
						value={addThousandSeparator(totalSupply) || ''}
						onChange={onSupplyChange}
						inputMode="numeric"
						pattern="[0-9,]*"
						placeholder="Total supply"
						id="tokenSupply"
						className={styles.textbox}
					/>
				</InputGroup>

				<div
					className={classNames(
						styles.inputGroup,
						styles.receivedTokensContainer
					)}
				>
					<span className={styles.label}>You will get</span>
					<div className={styles.textbox}>
						{addThousandSeparator(receivedSupply) || '0'}
					</div>
					<span className={styles.label}>tokens</span>
				</div>

				<InputGroup
					label="Decimals"
					description={`Number of decimal points that a single token can
							be divided into. The default and recommended
							value to use is ${tokenConstants.decimals.default}.`}
					id="tokenDecimals"
					error={errors.tokenDecimals?.message}
					{...inputGroupDefaults}
				>
					<input
						{...register('tokenDecimals', {
							valueAsNumber: true,
							...tokenConstants.decimals.schema,
						})}
						type="number"
						inputMode="numeric"
						pattern="[0-9]*"
						id="tokenDecimals"
						className={styles.textbox}
					/>
				</InputGroup>

				<InputGroup
					label="Shareholder tax distribution"
					description="Tax subtracted on each token transfer which is later
							given to each token shareholder as dividends."
					id="tokenDistributionTax"
					error={errors.tokenDistributionTax?.message}
					{...inputGroupDefaults}
				>
					<div className={styles.sliderContainer}>
						<span
							className={styles.sliderLabel}
							ref={distributionValueRef}
						>
							{distributionTax || 0}%
						</span>
						<input
							{...registerDistributionTax}
							type="range"
							min={tokenConstants.distributionTax.min}
							max={tokenConstants.distributionTax.max}
							step={tokenConstants.distributionTax.step}
							id="tokenDistributionTax"
							className={styles.slider}
							ref={(e) => {
								registerDistributionTax.ref(e)
								distributionSliderRef.current = e
							}}
						/>
						<div className={styles.sliderRangeLabels}>
							<span>{tokenConstants.distributionTax.min}%</span>
							<span>{tokenConstants.distributionTax.max}%</span>
						</div>
					</div>
				</InputGroup>
			</div>
		</>
	)
}
