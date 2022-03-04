import { useState, useEffect, useRef } from 'react'
import { RawDraftContentState } from 'draft-js'
import classNames from 'classnames'

import { INewProjectStepProps } from '@/types'
import { project as projectConstants, projectTags } from '@/constants'
import { handleBlur } from '@/utils/element'
import InputGroup from '@/components/InputGroup'
import RichEditor from '@/components/RichEditor'
import SkeletonImage from '@/components/SkeletonImage'

import UploadVector from '@/public/upload.svg'
import ArrowHead from '@/public/arrowhead.svg'
import ArrowVector from '@/public/arrow.svg'
import CheckVector from '@/public/check.svg'

import styles from '@/styles/FormStep.module.scss'
import checkboxStyles from '@/styles/CheckboxList.module.scss'
import 'draft-js/dist/Draft.css'

const generateImageBlob = (file: File): string => {
	if (!file) return ''
	try {
		return URL.createObjectURL(file) || ''
	} catch (e) {
		return ''
	}
}

export default function ProjectStep({
	register,
	errors,
	setValue,
	watch,
	inputGroupDefaults,
}: INewProjectStepProps) {
	const [logoPreview, setLogoPreview] = useState('')
	const [showTags, setShowTags] = useState(false)
	const toggleShowTags = () => setShowTags((prevState) => !prevState)
	const [tagList, setTagList] = useState(
		projectTags.map((tag) => ({ ...tag, checked: false }))
	)
	const [customTag, setCustomTag] = useState('')
	const descriptionRef = useRef<HTMLDivElement>(null)
	const logoRef = useRef<HTMLInputElement>(null)
	const [logo] = watch(['logo'])

	const onLogoClick = () => logoRef?.current?.click()

	const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file?.name) return
		setValue('logo', file, { shouldValidate: true })
		setLogoPreview(generateImageBlob(file))
	}

	const onDescriptionChange = (rawState: RawDraftContentState) => {
		setValue('description', rawState, { shouldValidate: true })
	}

	const toggleTag = (index: number) => {
		const newTagList = tagList.map((tag, tagIndex) => ({
			...tag,
			checked: tagIndex === index ? !tag.checked : tag.checked,
		}))
		setTagList(newTagList)

		const checkedValues = newTagList
			.filter(({ checked }) => checked)
			.map(({ value }) => value)
		setValue('tags', checkedValues, { shouldValidate: true })
	}

	const onCustomTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
		if (value && value.length > projectConstants.tags.customMaxLength) {
			return
		}
		setCustomTag(value)
	}

	const onCustomTagSubmit = () => {
		if (!customTag) return
		const value = customTag.trim()
		const newTag = {
			label: value,
			value: value.toLowerCase(),
			checked: true,
		}

		if (tagList.find(({ value }) => value === newTag.value)) return
		setTagList((prevState) => [...prevState, newTag])

		const checkedValues = tagList
			.filter(({ checked }) => checked)
			.map(({ value }) => value)
		setValue('tags', [...checkedValues, newTag.value], {
			shouldValidate: true,
		})

		setCustomTag('')
	}

	const onCustomTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		onCustomTagSubmit()
	}

	// Create uncontrolled form fields
	useEffect(() => {
		register('logo', projectConstants.logo.schema)
		register('tags', projectConstants.tags.schema)
		register('description', projectConstants.description.schema)
	}, [register])

	useEffect(() => {
		setLogoPreview(generateImageBlob(logo))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<h2 className={styles.title}>Project details</h2>

			<InputGroup
				label="Name"
				help="Project name that will be displayed in the Astrano platform. The project name cannot be changed after creating the project."
				id="name"
				error={errors.name?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('name', projectConstants.name.schema)}
					type="text"
					minLength={projectConstants.name.minLength}
					// maxLength={projectConstants.name.maxLength}
					placeholder="Name"
					id="name"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Logo"
				help="Choose the image to upload. This image will be used as the project's logo in the Astrano platform as well as the token's logo in the blockchain explorer and other marketplaces."
				id="logo"
				error={errors.logo?.message}
				{...inputGroupDefaults}
			>
				<input
					type="file"
					accept="image/png, image/svg+xml, image/jpeg, image/webp"
					id="logo"
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

			<InputGroup
				label="Tags"
				help={`Category tags used to identify unique projects. A maximum of ${projectConstants.tags.max} tags can be used.`}
				id="tags"
				error={errors.tags?.message}
				labelOnClick={toggleShowTags}
				{...inputGroupDefaults}
			>
				<div
					className={classNames(styles.dropdownContainer, {
						[styles.open]: showTags,
					})}
					onBlur={(e) => handleBlur(e, () => setShowTags(false))}
				>
					<button
						id="tags"
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
			</InputGroup>

			<InputGroup
				label="Detailed description"
				help="The project description can help project creators explain their project/company/idea to attract investors."
				id="description"
				error={errors.description?.message}
				labelOnClick={() => descriptionRef?.current?.click()}
				{...inputGroupDefaults}
			>
				<RichEditor
					// initialRawState={project.description}
					onChange={onDescriptionChange}
					placeholder="Detailed description"
					containerClassName={styles.projectDescriptionContainer}
					editorClassName={styles.projectDescriptionEditor}
					ref={descriptionRef}
				/>
			</InputGroup>
		</>
	)
}
