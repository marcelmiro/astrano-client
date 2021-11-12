import { useState, useEffect, useRef } from 'react'
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { RawDraftContentState } from 'draft-js'
import classNames from 'classnames'

import { NewForm as IForm } from '@/types'
import { project as projectConstants, projectTags } from '@/constants'
import { handleBlur } from '@/utils/element'
import InputGroup from '@/components/InputGroup'
import TextareaAutoHeight from '@/components/TextareaAutoHeight'
import RichEditor from '@/components/RichEditor'

import ArrowHead from '@/public/arrowhead.svg'
import ArrowVector from '@/public/arrow.svg'
import CheckVector from '@/public/check.svg'

import styles from '@/styles/FormStep.module.scss'
import checkboxStyles from '@/styles/CheckboxList.module.scss'
import 'draft-js/dist/Draft.css'

interface ProjectStepProps {
	register: UseFormRegister<IForm>
	errors: FieldErrors
	setValue: UseFormSetValue<IForm>
	inputGroupDefaults: Record<string, string>
}

export default function ProjectStep({
	register,
	errors,
	setValue,
	inputGroupDefaults,
}: ProjectStepProps) {
	const [showTags, setShowTags] = useState(false)
	const toggleShowTags = () => setShowTags((prevState) => !prevState)
	const [tagList, setTagList] = useState(
		projectTags.map((tag) => ({ ...tag, checked: false }))
	)
	const [customTag, setCustomTag] = useState('')
	const descriptionRef = useRef<HTMLDivElement>(null)

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
		register('tags', projectConstants.tags.schema)
		register('description', projectConstants.description.schema)
	}, [register])

	return (
		<>
			<h2 className={styles.title}>Project details</h2>

			<InputGroup
				label="Name"
				description="This is the name that will be displayed in the Astrano platform. The project name cannot be changed after creating the project."
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
				label="Tags"
				description={`Category tags used to identify unique projects. A maximum of ${projectConstants.tags.max} tags can be used.`}
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
				label="One-line description"
				id="summary"
				error={errors.summary?.message}
				{...inputGroupDefaults}
			>
				<TextareaAutoHeight
					{...register('summary', projectConstants.summary.schema)}
					// maxLength={projectConstants.summary.maxLength}
					placeholder="One-line description"
					name="summary"
					id="summary"
					className={styles.textbox}
					style={{ minHeight: '4rem' }}
				/>
			</InputGroup>

			<InputGroup
				label="Detailed description"
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

			<InputGroup
				label="Project relationship"
				id="relationship"
				error={errors.relationship?.message}
				{...inputGroupDefaults}
			>
				<TextareaAutoHeight
					{...register(
						'relationship',
						projectConstants.relationship.schema
					)}
					// maxLength={projectConstants.summary.maxLength}
					placeholder="Project relationship (e.g. CEO, founder or employee)"
					name="relationship"
					id="relationship"
					className={styles.textbox}
					style={{ minHeight: '6.25rem' }}
				/>
			</InputGroup>
		</>
	)
}
