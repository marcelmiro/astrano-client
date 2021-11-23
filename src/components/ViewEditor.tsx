import Head from 'next/head'
import {
	Editor,
	EditorState,
	convertFromRaw,
	RawDraftContentState,
} from 'draft-js'
import classNames from 'classnames'

import 'draft-js/dist/Draft.css'
import styles from '@/styles/Editor.module.scss'

interface ViewEditorProps {
	rawState: RawDraftContentState
	className?: string
	NotFoundComponent: (params: Record<string, unknown>) => JSX.Element
}

export default function ViewEditor({
	rawState,
	className,
	NotFoundComponent,
}: ViewEditorProps) {
	// Set entityMap if doesn't exist
	if (rawState && !rawState.entityMap) rawState.entityMap = {}

	const contentState = rawState?.blocks ? convertFromRaw(rawState) : null
	if (!contentState?.hasText()) {
		return <NotFoundComponent className={className} />
	}

	const editorState = EditorState.createWithContent(contentState)

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,600;1,400;1,500;1,600&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<div
				className={classNames(styles.editorStyles, className)}
				suppressHydrationWarning
			>
				{process.browser && (
					<Editor
						editorState={editorState}
						/* eslint-disable @typescript-eslint/no-empty-function */
						onChange={() => {}}
						readOnly
						spellCheck={false}
					/>
				)}
			</div>
		</>
	)
}
