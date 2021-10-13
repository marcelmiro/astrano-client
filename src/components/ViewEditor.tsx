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
	notFoundComponent: any
}

export default function ViewEditor({
	rawState,
	className,
	notFoundComponent: NotFoundComponent,
}: ViewEditorProps) {
	const contentState = rawState ? convertFromRaw(rawState) : null
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
						onChange={() => {}}
						readOnly
						spellCheck={false}
					/>
				)}
			</div>
		</>
	)
}
