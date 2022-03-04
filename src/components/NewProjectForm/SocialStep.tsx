// import { useState } from 'react'
export {}
/* import {
	UseFormRegister,
	FieldErrors,
	Control,
	useFieldArray,
} from 'react-hook-form'

import { NewForm as IForm } from '@/types'
import { social as socialConstants } from '@/constants'
import InputGroup from '@/components/InputGroup'
import ErrorMessage from '@/components/ErrorMessage'

import styles from '@/styles/FormStep.module.scss'

interface SocialStepProps {
	register: UseFormRegister<IForm>
	errors: FieldErrors
	control: Control<IForm, object>
	generalError?: string
	inputGroupDefaults: Record<string, string>
}

export default function SocialStep({
	register,
	errors,
	control,
	generalError,
	inputGroupDefaults,
}: SocialStepProps) {
	const socialUrls = useFieldArray({ control, name: 'socialUrls' })

	// const newSocialUrl = (field: string, value: string) =>
	// 	socialUrls.append({ [field]: value })

	return (
		<>
			<h2 className={styles.title}>Social details</h2>

			<InputGroup
				label="Website"
				description="Project's website URL from where potential investors can research about the project"
				id="website"
				error={errors.website?.message}
				{...inputGroupDefaults}
			>
				<input
					{...register('website', socialConstants.website.schema)}
					type="text"
					inputMode="url"
					minLength={socialConstants.website.minLength}
					maxLength={socialConstants.website.maxLength}
					placeholder="Website"
					id="website"
					className={styles.textbox}
				/>
			</InputGroup>

			<InputGroup
				label="Social URLs"
				description="Project URLs to social media sites (e.g. Instagram)"
				id="socialUrls"
				error={errors.socialUrls?.message}
				{...inputGroupDefaults}
			>
				{socialUrls.fields.map(({ id }, index) => (
					<div key={id}>
						<input
							type="text"
							{...register(`socialUrls.${index}.name`)}
							className={styles.textbox}
						/>
						<input
							type="text"
							inputMode="url"
							{...register(`socialUrls.${index}.url`)}
							className={styles.textbox}
						/>
					</div>
				))}

				<input
					type="text"
					// onChange={(e) => newSocialUrl('url', e.target.value)}
					placeholder="Site URL"
					className={styles.textbox}
				/>
			</InputGroup>

			<ErrorMessage message={generalError} className={styles.error} />
		</>
	)
}
 */