import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'
import { RawDraftContentState } from 'draft-js'

import {
	pagesMetaData,
	projectTags as projectTagList,
	tokenCreationTax,
	token as tokenConstants,
	project as projectConstants,
} from '@/constants'
import { getItem, setItem } from '@/helpers/localStorage'
import {
	expToNumber,
	addThousandSeparator,
	safeMultiplication,
} from '@/utils/number'
import { handleBlur } from '@/utils/element'

import Meta from '@/components/Meta'
import Navbar from '@/components/Navbar'
import InputGroup from '@/components/InputGroup'
import SkeletonImage from '@/components/SkeletonImage'
import RichEditor from '@/components/RichEditor'

import UploadVector from '@/public/upload.svg'
import ArrowHead from '@/public/arrowhead.svg'
import ArrowVector from '@/public/arrow.svg'
import CheckVector from '@/public/check.svg'

import styles from '@/styles/new.module.scss'
import checkboxStyles from '@/styles/CheckboxList.module.scss'
import 'draft-js/dist/Draft.css'

const { new: MetaData } = pagesMetaData

interface IToken {
	name: string
	symbol: string
	logo: File
	totalSupply: string
	receivedSupply: string
	decimals: number
	distributionTax: number
}

interface IProject {
	name: string
	tags: string[]
	summary: string
	description: RawDraftContentState
	relationship: string
}

interface IProjectTag {
	label: string
	value: string
	checked: boolean
}

const inputGroupDefaults = {
	containerClassName: styles.inputGroup,
	labelClassName: styles.label,
	inputClassName: styles.textbox,
	descriptionClassName: styles.description,
}

const TokenPage = ({
	token,
	updateToken,
}: {
	token: Partial<IToken>
	updateToken(newProps: Partial<IToken>): void
}) => {
	const [showAdvanced, setShowAdvanced] = useState(false)
	const toggleShowAdvanced = () => setShowAdvanced((prev) => !prev)
	const [logoPreview, setLogoPreview] = useState('')
	const logoInput = useRef(null)
	const distributionSlider = useRef(null)
	const distributionValue = useRef(null)

	// Get logo preview
	useEffect(() => {
		if (!token.logo?.name) return setLogoPreview('')
		const blob = URL.createObjectURL(token.logo)
		setLogoPreview(blob || '')
	}, [token.logo])

	// Calculate received tokens from token's total supply
	useEffect(() => {
		const totalSupply = token.totalSupply
			? parseInt(token.totalSupply)
			: undefined
		if (!totalSupply) return updateToken({ receivedSupply: '0' })

		const receivedSupply = safeMultiplication(
			totalSupply,
			1 - tokenCreationTax
		)
		const processedReceivedSupply = receivedSupply
			? expToNumber(receivedSupply) || ''
			: token.totalSupply

		updateToken({ receivedSupply: processedReceivedSupply })
	}, [updateToken, token.totalSupply])

	// Calculate slider value's position
	useEffect(() => {
		if (!distributionSlider.current || !distributionValue.current) {
			return
		}
		const input: HTMLInputElement = distributionSlider.current
		const valueElement: HTMLElement = distributionValue.current

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
			valueElement.clientWidth / 2
		valueElement.style.left = position - offset + 'px'
	}, [token.distributionTax, showAdvanced])

	const onLogoClick = () => {
		logoInput.current && (logoInput.current as HTMLElement).click()
	}

	const onNameChange = (value: string) => {
		value = value.replace(/[^a-zA-Z0-9 ]/g, '')
		if (value && value.length > tokenConstants.name.maxLength) return
		updateToken({ name: value })
	}
	const onSymbolChange = (value: string) => {
		value = value.replace(/[^a-zA-Z0-9]/g, '')
		if (value && value.length > tokenConstants.symbol.maxLength) return
		updateToken({ symbol: value.toUpperCase() })
	}
	const onLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		updateToken({ logo: file })
	}
	const onSupplyChange = (value: string) => {
		value = value?.split('.')[0].replace(/\D/g, '')
		if (value && value.length > tokenConstants.totalSupply.maxLength) {
			return
		}
		updateToken({ totalSupply: value })
	}
	const onDecimalsChange = (value: string) => {
		const numericValue = parseInt(value)
		if (
			numericValue &&
			numericValue.toString().length > tokenConstants.decimals.maxLength
		) {
			return
		}
		updateToken({ decimals: numericValue })
	}
	const onDistributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value)
		if (
			value < tokenConstants.distributionTax.min ||
			value > tokenConstants.distributionTax.max
		) {
			return
		}
		updateToken({ distributionTax: value })
	}

	return (
		<form>
			<h2 className={styles.title}>Token details</h2>

			<InputGroup
				label="Name"
				value={token.name || ''}
				onChange={onNameChange}
				minLength={tokenConstants.name.minLength}
				maxLength={tokenConstants.name.maxLength}
				id="tokenName"
				{...inputGroupDefaults}
			/>

			<InputGroup
				label="Ticker/Symbol"
				description="Ticker symbol must be between 3 and 5 letters."
				value={token.symbol || ''}
				onChange={onSymbolChange}
				minLength={tokenConstants.symbol.minLength}
				maxLength={tokenConstants.symbol.maxLength}
				id="tokenSymbol"
				{...inputGroupDefaults}
			/>

			<div className={styles.inputGroup}>
				<label htmlFor="tokenLogo" className={styles.label}>
					Logo
				</label>
				<p className={styles.description}>
					Choose your file to upload.
				</p>
				<input
					type="file"
					accept="image/png, image/svg+xml, image/jpeg, image/webp"
					onChange={onLogoSelect}
					id="tokenLogo"
					ref={logoInput}
				/>
				<div
					className={classNames(styles.fileInput, {
						[styles.selectedFile]: token.logo?.name,
					})}
				>
					{token.logo?.name ? (
						<div className={styles.selectedFileContent}>
							{logoPreview && (
								<SkeletonImage
									src={logoPreview}
									alt="Token logo preview"
									objectFit="cover"
									className={styles.filePreview}
								/>
							)}
							<div
								className={
									styles.selectedFileContentSecondColumn
								}
							>
								<p>{token.logo.name}</p>
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
			</div>

			<button
				className={classNames(styles.toggleButton, {
					[styles.open]: showAdvanced,
				})}
				onClick={toggleShowAdvanced}
			>
				<ArrowHead />
				Advanced settings
			</button>

			{showAdvanced && (
				<>
					<InputGroup
						label="Total supply"
						description={`Total number of tokens to create. This number cannot be changed in the future and new tokens cannot be minted. The default and recommended value to use is 21,000,000. Astrano will keep ${
							tokenCreationTax * 100
						}% of the tokens created.`}
						value={
							token.totalSupply
								? addThousandSeparator(token.totalSupply) || ''
								: ''
						}
						onChange={onSupplyChange}
						inputMode="numeric"
						pattern="[0-9]*"
						id="tokenSupply"
						{...inputGroupDefaults}
					/>

					<div
						className={classNames(
							styles.inputGroup,
							styles.receivedTokensContainer
						)}
					>
						<span className={styles.label}>You will get</span>
						<div className={styles.textbox}>
							{token.receivedSupply
								? addThousandSeparator(token.receivedSupply)
								: '0'}
						</div>
						<span className={styles.label}>tokens</span>
					</div>

					<InputGroup
						label="Decimals"
						description={`Number of decimal points that a single token can
							be divided into. The default and recommended
							value to use is ${tokenConstants.decimals.default}.`}
						inputType="number"
						value={token.decimals?.toString() || ''}
						onChange={onDecimalsChange}
						inputMode="numeric"
						pattern="[0-9]*"
						id="tokenDecimals"
						{...inputGroupDefaults}
					/>

					<div className={styles.inputGroup}>
						<label
							htmlFor="tokenDistributionTax"
							className={styles.label}
						>
							Shareholder distribution tax
						</label>
						<p className={styles.description}>
							Tax subtracted on each token transfer which is later
							given to each token shareholder as dividends.
						</p>
						<div className={styles.sliderContainer}>
							<span
								className={styles.sliderLabel}
								ref={distributionValue}
							>
								{token.distributionTax}%
							</span>
							<input
								type="range"
								min={tokenConstants.distributionTax.min}
								max={tokenConstants.distributionTax.max}
								step="0.1"
								id="tokenDistributionTax"
								value={token.distributionTax}
								onChange={onDistributionChange}
								className={styles.slider}
								ref={distributionSlider}
							/>
							<div className={styles.sliderRangeLabels}>
								<span>
									{tokenConstants.distributionTax.min}%
								</span>
								<span>
									{tokenConstants.distributionTax.max}%
								</span>
							</div>
						</div>
					</div>
				</>
			)}
		</form>
	)
}

const ProjectPage = ({
	project,
	updateProject,
	tagList,
	updateTagList,
}: {
	project: Partial<IProject>
	updateProject(newProps: Partial<IProject>): void
	tagList: IProjectTag[]
	updateTagList(newTagList: IProjectTag[]): void
}) => {
	const [showTags, setShowTags] = useState(false)
	const [customTag, setCustomTag] = useState('')
	const toggleShowTags = () => setShowTags((prev) => !prev)
	const descriptionEditor = useRef<HTMLDivElement | null>(null)

	const onNameChange = (value: string) => {
		value = value.replace(/[^a-zA-Z0-9 ]/g, '')
		if (value && value.length > projectConstants.name.maxLength) return
		updateProject({ name: value })
	}
	const toggleTag = (index: number) => {
		if (!tagList[index].checked) {
			const checkedTags = tagList.filter(({ checked }) => checked)
			if (checkedTags.length >= projectConstants.tags.max) return
		}

		const newTagList = tagList.map((tag, tagIndex) => ({
			...tag,
			checked: tagIndex === index ? !tag.checked : tag.checked,
		}))
		updateTagList(newTagList)

		const checkedValues = newTagList
			.filter(({ checked }) => checked)
			.map(({ value }) => value)
		updateProject({ tags: checkedValues })
	}
	const onCustomTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
		if (value && value.length > projectConstants.tags.customMaxLength) {
			return
		}
		setCustomTag(value)
	}
	const onCustomTagSubmit = () => {
		if (!customTag || typeof customTag !== 'string') return
		const value = customTag.trim()
		const newTag = {
			label: value,
			value: value.toLowerCase(),
			checked: true,
		}

		if (
			tagList.find(({ value }) => value === newTag.value) ||
			(project.tags && project.tags.length >= projectConstants.tags.max)
		) {
			return
		}

		updateTagList([...tagList, newTag])
		updateProject({
			tags: [...(project.tags || []), newTag.value],
		})
		setCustomTag('')
	}
	const onCustomTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		onCustomTagSubmit()
	}
	const onSummaryChange = (value: string) => {
		if (value && value.length > projectConstants.summary.maxLength) {
			return
		}
		updateProject({ summary: value })
	}
	const onDescriptionChange = useCallback(
		(rawState: RawDraftContentState) => {
			updateProject({ description: rawState })
		},
		[updateProject]
	)
	const onRelationshipChange = (value: string) => {
		if (value && value.length > projectConstants.relationship.maxLength) {
			return
		}
		updateProject({ relationship: value })
	}

	return (
		<div>
			<h2 className={styles.title}>Project details</h2>

			<InputGroup
				label="Name"
				value={project.name || ''}
				onChange={onNameChange}
				minLength={projectConstants.name.minLength}
				maxLength={projectConstants.name.maxLength}
				id="projectName"
				{...inputGroupDefaults}
			/>

			<div className={styles.inputGroup}>
				<label htmlFor="projectTags" className={styles.label}>
					Tags
				</label>
				<p className={styles.description}>
					Category tags used to identify unique projects. A maximum of
					{projectConstants.tags.max} tags can be used.
				</p>
				<div
					className={classNames(styles.dropdownContainer, {
						[styles.open]: showTags,
					})}
					onBlur={(e) => handleBlur(e, () => setShowTags(false))}
				>
					<button
						id="projectTags"
						className={classNames(
							styles.textbox,
							styles.dropdownButton
						)}
						onClick={toggleShowTags}
					>
						<div className={styles.dropdownButtonContent}>
							{tagList.filter(({ checked }) => checked).length > 0
								? tagList
										.filter(({ checked }) => checked)
										.map(({ label }, index) => (
											<div
												className={styles.tag}
												key={index}
											>
												{label}
											</div>
										))
								: 'Select tags'}
						</div>
						<ArrowHead />
					</button>
					<div className={styles.dropdownContent} tabIndex={0}>
						{tagList.map(({ label, checked }, index) => (
							<label className={checkboxStyles.item} key={index}>
								<input
									type="checkbox"
									value={label}
									name="projectTags"
									checked={checked}
									onChange={() => toggleTag(index)}
								/>
								<div className={checkboxStyles.checkbox}>
									<CheckVector
										className={checkboxStyles.checkboxIcon}
									/>
								</div>
								{label}
							</label>
						))}

						<label className={styles.customTag}>
							<input
								type="text"
								value={customTag}
								onChange={onCustomTagChange}
								onKeyPress={onCustomTagKeyPress}
								placeholder="Custom tag"
								className={styles.textbox}
							/>
							<button
								onClick={onCustomTagSubmit}
								className={styles.customTagSubmit}
							>
								<ArrowVector />
							</button>
						</label>
					</div>
				</div>
			</div>

			<InputGroup
				label="One-line description"
				textarea
				value={project.summary || ''}
				onChange={onSummaryChange}
				maxLength={projectConstants.summary.maxLength}
				id="projectSummary"
				minHeight="4rem"
				{...inputGroupDefaults}
			/>

			<div className={styles.inputGroup}>
				<label
					className={styles.label}
					onClick={() => descriptionEditor.current?.click()}
				>
					Detailed description
				</label>

				<RichEditor
					onChange={onDescriptionChange}
					initialRawState={project.description}
					placeholder="Detailed description"
					containerClassName={styles.descriptionContainer}
					toolboxClassName={styles.descriptionToolbox}
					toolboxButtonClassName={styles.descriptionToolboxButton}
					editorClassName={styles.descriptionEditor}
					editorRef={descriptionEditor}
				/>
			</div>

			<InputGroup
				label="Project relationship"
				textarea
				value={project.relationship || ''}
				onChange={onRelationshipChange}
				maxLength={projectConstants.relationship.maxLength}
				placeholder="Project relationship (e.g. CEO, founder or employee)"
				id="projectRelationship"
				minHeight="6.25rem"
				{...inputGroupDefaults}
			/>
		</div>
	)
}

const pages = ['Token', 'Project']

export default function New() {
	const [activePage, setActivePage] = useState(0)
	const [token, setToken] = useState<Partial<IToken>>({
		totalSupply: tokenConstants.totalSupply.default.toString(),
		decimals: tokenConstants.decimals.default,
		distributionTax: tokenConstants.distributionTax.default,
	})
	const [project, setProject] = useState<Partial<IProject>>({
		tags: [],
	})
	const [projectTags, setProjectTags] = useState(
		projectTagList.map((tag) => ({
			...tag,
			checked: false,
		}))
	)
	const isLastPage = activePage === pages.length - 1
	const isMounted = useRef(false)

	const updateToken = useCallback((newProps: Partial<IToken>) => {
		setToken((prevState) => ({ ...prevState, ...newProps }))
	}, [])
	const updateProject = useCallback((newProps: Partial<IProject>) => {
		setProject((prevState) => ({ ...prevState, ...newProps }))
	}, [])
	const updateProjectTags = useCallback((newTagList: IProjectTag[]) => {
		setProjectTags(newTagList)
	}, [])

	const nextPageAction = () => {
		if (isLastPage) submitProject()
		else setActivePage((page) => page + 1)
	}
	const submitProject = () => {
		const finalObject = { token, project }
		console.log(finalObject)
		alert('Submitting new project...')
	}

	const loadStoredProjectTags = (storedTagList: string[]) => {
		if (
			!storedTagList ||
			!Array.isArray(storedTagList) ||
			storedTagList.length === 0
		) {
			return
		}

		const newTagList = projectTags.map((tag) => ({
			...tag,
			checked: tag.checked || storedTagList.includes(tag.value),
		}))

		for (const newTagValue of storedTagList) {
			const tagMatch = projectTags.find(
				({ value }) => value === newTagValue
			)
			if (!tagMatch)
				newTagList.push({
					label: newTagValue,
					value: newTagValue,
					checked: true,
				})
		}
		const checkedValues = newTagList
			.filter(({ checked }) => checked)
			.map(({ value }) => value)
		updateProject({ tags: checkedValues })
		setProjectTags(newTagList)
	}

	// On page change
	useEffect(() => window.scrollTo(0, 0), [activePage])

	// On token change save to local storage
	useEffect(() => {
		if (!isMounted.current) return
		const { logo, ...tokenProps } = token
		setItem('new.token', tokenProps)
	}, [token])

	// On project change save to local storage
	useEffect(() => {
		if (!isMounted.current) return
		setItem('new.project', project)
	}, [project])

	// On component mount
	useEffect(() => {
		// Load token data from local storage
		const storedToken = getItem('new.token')
		if (storedToken) {
			for (const [key, value] of Object.entries(storedToken)) {
				if (value) updateToken({ [key]: value })
			}
		}

		// Load project data from local storage
		const storedProject = getItem('new.project')
		if (storedProject) {
			for (const [key, value] of Object.entries(storedProject)) {
				if (key === 'tags') loadStoredProjectTags(value as string[])
				else if (value) updateProject({ [key]: value })
			}
		}

		isMounted.current = true
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const renderActivePage = useCallback(
		(activePage) => {
			switch (activePage) {
				case 0:
					return <TokenPage token={token} updateToken={updateToken} />
				case 1:
					return (
						<ProjectPage
							project={project}
							updateProject={updateProject}
							tagList={projectTags}
							updateTagList={updateProjectTags}
						/>
					)
				default:
					setActivePage(0)
			}
		},
		[
			token,
			updateToken,
			project,
			updateProject,
			projectTags,
			updateProjectTags,
		]
	)

	return (
		<>
			<Meta title={MetaData.title} description={MetaData.description} />

			<Navbar />

			<div className={styles.container}>
				<h1 className={styles.h1}>Create a project</h1>
				<h2 className={styles.h2}>
					Fund your project by creating your own cryptocurrency token.
					Fields with a default value are not required to be filled
					in.
				</h2>

				{/* PAGE STATUS */}
				<div className={styles.statusContainer}>
					{pages.map((page, index) => (
						<div
							className={classNames(styles.pageStatus, {
								[styles.active]: activePage === index,
							})}
							key={index}
						>
							<div className={styles.statusIcon}>{index + 1}</div>
							<div className={styles.statusTitle}>{page}</div>
						</div>
					))}
				</div>

				{renderActivePage(activePage)}

				<div className={styles.pageActions}>
					{activePage !== 0 && (
						<button
							className={styles.pageButton}
							onClick={() => setActivePage((page) => page - 1)}
						>
							Back
						</button>
					)}
					<button
						className={classNames(
							styles.pageButton,
							styles.filledButton
						)}
						onClick={nextPageAction}
					>
						{isLastPage ? 'Create project' : 'Next'}
					</button>
				</div>
			</div>
		</>
	)
}
