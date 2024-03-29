import { useState, useRef, useEffect, forwardRef } from 'react'
import Head from 'next/head'
import {
	Editor,
	EditorState,
	RichUtils,
	getDefaultKeyBinding,
	convertToRaw,
	RawDraftContentState,
	convertFromRaw,
} from 'draft-js'
import classNames from 'classnames'

import { editorConstants } from '@/constants'

import 'draft-js/dist/Draft.css'
import styles from '@/styles/Editor.module.scss'

const { inlineControls: INLINE_CONTROLS, blockControls: BLOCK_CONTROLS } =
	editorConstants

interface RichEditorProps {
	initialRawState?: RawDraftContentState
	onChange?(rawContentState: RawDraftContentState): void
	placeholder?: string
	containerClassName?: string
	toolboxClassName?: string
	toolboxButtonClassName?: string
	editorClassName?: string
	spellCheck?: boolean
}

type InlineStyle = 'BOLD' | 'ITALIC' | 'UNDERLINE'

type BlockType =
	| 'header-one'
	| 'header-two'
	| 'header-three'
	| 'header-four'
	| 'unordered-list-item'
	| 'ordered-list-item'

interface ButtonBase {
	active: boolean
	onToggle(): void
	title?: string
	className?: string
}
interface ButtonWithLabel extends ButtonBase {
	label: string
	icon?: never
}
interface ButtonWithImage extends ButtonBase {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	icon: any
	label?: never
}
type ButtonProps = ButtonWithLabel | ButtonWithImage

interface ToolboxProps {
	editorState: EditorState
	toggleInlineStyle(style: InlineStyle): void
	toggleBlockType(type: BlockType): void
	toolboxClassName?: string
	buttonClassName?: string
}

const Button = ({
	label,
	icon: Icon,
	active,
	onToggle,
	title,
	className,
}: ButtonProps) => {
	const onMouseDown = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault()
		onToggle()
	}

	return (
		<button
			className={classNames(styles.toolboxButton, className, {
				[styles.active]: active,
			})}
			onMouseDown={onMouseDown}
			title={title}
		>
			{Icon ? <Icon /> : label}
		</button>
	)
}

const Toolbox = ({
	editorState,
	toggleInlineStyle,
	toggleBlockType,
	buttonClassName,
	toolboxClassName,
}: ToolboxProps) => {
	const currentStyle = editorState.getCurrentInlineStyle()
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(editorState.getSelection().getStartKey())
		.getType()

	return (
		<div className={classNames(styles.toolbox, toolboxClassName)}>
			{INLINE_CONTROLS.map(({ label, style, title }, index) => (
				<Button
					label={label}
					active={currentStyle.has(style)}
					onToggle={() => toggleInlineStyle(style as InlineStyle)}
					title={title}
					className={buttonClassName}
					key={index}
				/>
			))}

			{BLOCK_CONTROLS.map(({ label, icon, style, title }, index) => (
				<Button
					label={label}
					icon={icon}
					active={style === blockType}
					onToggle={() => toggleBlockType(style as BlockType)}
					title={title}
					className={buttonClassName}
					key={index}
				/>
			))}
		</div>
	)
}

export default forwardRef<HTMLDivElement, RichEditorProps>(function RichEditor(
	{
		initialRawState,
		onChange,
		placeholder,
		containerClassName,
		toolboxClassName,
		toolboxButtonClassName,
		editorClassName,
		spellCheck = true,
	},
	ref
) {
	const [editorState, setEditorState] = useState(EditorState.createEmpty())
	const editor = useRef<Editor>(null)

	const focus = () => editor?.current?.focus()

	const handleChange = (editorState: EditorState) => {
		setEditorState(editorState)
		if (onChange) {
			onChange(convertToRaw(editorState.getCurrentContent()))
		}
	}

	const handleKeyCommand = (command: string, editorState: EditorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command)
		if (newState) {
			setEditorState(newState)
			return 'handled'
		} else return 'not-handled'
	}

	// Convert tab character to 4 spaces
	const mapKeyToEditorCommand = (e: React.KeyboardEvent) => {
		if (e.key === 'Tab') {
			const newState = RichUtils.onTab(e, editorState, 4)
			if (newState !== editorState) setEditorState(newState)
			return null
		}
		return getDefaultKeyBinding(e)
	}

	// On block type click
	const toggleBlockType = (type: BlockType) => {
		setEditorState((prevState) =>
			RichUtils.toggleBlockType(prevState, type)
		)
	}

	// On inline style click
	const toggleInlineStyle = (style: InlineStyle) => {
		setEditorState((prevState) =>
			RichUtils.toggleInlineStyle(prevState, style)
		)
	}

	useEffect(() => {
		const contentState = initialRawState
			? convertFromRaw(initialRawState)
			: null
		if (!contentState) return
		setEditorState(EditorState.createWithContent(contentState))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
			</Head>

			<div className={classNames(styles.container, containerClassName)}>
				<Toolbox
					editorState={editorState}
					toggleInlineStyle={toggleInlineStyle}
					toggleBlockType={toggleBlockType}
					toolboxClassName={toolboxClassName}
					buttonClassName={toolboxButtonClassName}
				/>

				<div
					className={classNames(styles.editor, editorClassName)}
					onClick={focus}
					ref={ref}
					suppressHydrationWarning
				>
					{process.browser && (
						<Editor
							editorState={editorState}
							onChange={handleChange}
							handleKeyCommand={handleKeyCommand}
							keyBindingFn={mapKeyToEditorCommand}
							placeholder={placeholder}
							ref={editor}
							spellCheck={spellCheck}
						/>
					)}
				</div>
			</div>
		</>
	)
})
