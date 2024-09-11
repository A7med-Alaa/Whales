import React, { useEffect, useRef, useState } from "react"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import Cover from "./Cover";
import { useAtom } from "jotai";
import { currentMetadataNoteAtom, currentNoteAtom, noteFilesAtom, noteFilesMetadataAtom } from "./globals";
import StatusBar from "./StatusBar";
import { PartialBlock } from "@blocknote/core";
interface ContentPageProps {
	hide: boolean
}
export default function ContentPage({ hide }: ContentPageProps) {
	const [coverUrl, setCoverUrl] = useState('');

	const [currentNote] = useAtom(currentNoteAtom);
	const [currentMetadata] = useAtom(currentMetadataNoteAtom)
	const [notes, setNotes] = useAtom(noteFilesAtom)
	const [metadatas, setNotesMetadata] = useAtom(noteFilesMetadataAtom)

	// let statusCode, statusTitle;
	const statusCode = useRef('')
	const statusTitle = useRef('')

	const currentContent = useRef({})
	const statusIsActive = useRef(false);
	const title = useRef('')
	const fileid = useRef(0)
	const cover = useRef('')

	let editor = useCreateBlockNote({
		trailingBlock: true,
		initialContent: [{ type: 'heading' }] as PartialBlock[],
	});

	async function refreshFiles() {
		// @ts-ignore
		window.electron.loadAllFiles()

		// @ts-ignore
		const allNotesFiles = await window.electron.getFiles()
		setNotes(allNotesFiles)
		// @ts-ignore
		const allMetadata = await window.electron.getMetadataFiles()
		setNotesMetadata(allMetadata)
	}

	useEffect(() => {
		fileid.current = currentNote.fileId
		if (currentNote.content !== null && currentNote.content !== undefined && currentNote.content !== JSON.stringify(editor.document)) {
			editor.replaceBlocks(editor.document, JSON.parse(currentNote.content))
			if (editor.document.length > 0) {
				editor.updateBlock(editor.document[0], { type: 'heading' })
			}
			// if (editor.document.at(0) !== undefined && editor.document.at(0) !== null) {
			// 	editor.updateBlock(editor.document.at(0)!, { type: 'heading', content: editor.document.at(0)?.content![0] ? editor.document.at(0)?.content![0].text : 'Untitled Note' })
			// }
		}
	}, [currentNote])

	useEffect(() => {
		if (currentMetadata.backgroundUrl !== 'none') {
			setCoverUrl(currentMetadata.backgroundUrl)
			cover.current = currentMetadata.backgroundUrl!
		} else {
			const fetchImg = async () => {
				//@ts-ignore
				const url = await window.electron.getRandomImage()
				setCoverUrl(url)
				cover.current = url
			}

			fetchImg();
		}

		title.current = currentMetadata.title
	}, [currentMetadata])
	// currentNote: {"fileId":968324,"metadata":{"title":"Untitled","parentId":0}}

	function saveNote() {
		// console.log('hello')

		const noteToSave = {
			fileId: fileid.current,
			metadata: {
				title: editor.document.at(0)?.content![0] ? editor.document.at(0)?.content![0].text : 'Untitled Note',
				parentId: currentMetadata.parentId,
				backgroundUrl: cover.current,
				createdAt: currentMetadata.createdAt
			},
			content: JSON.stringify(currentContent.current),
		}
		// @ts-ignore
		window.electron.saveFileLocal(JSON.stringify(noteToSave))

		refreshFiles()
	}

	function onContentChanged() {
		currentContent.current = editor.document
	}

	useEffect(() => {
		// @ts-ignore
		window.electron.onSaveFileShortcut((event, message) => {
			saveNote();
		})
	}, [])

	return (
		<div style={{ display: hide ? 'none' : 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<StatusBar activateRef={statusIsActive} status={statusCode.current} title={statusTitle.current} />
			<Cover url={coverUrl} />
			{/* <div style={{ height: '70px', marginTop: 20, display: 'flex', flexGrow: 1, alignItems: 'center' }}>
				<input onChange={e => {
					title.current = e.target.value
					setCurrentNote({ ...currentNote, title: e.target.value })
				}} value={currentNote.title} className='note-content-title-input' placeholder='Untitled' type="text" />
			</div> */}
			<div style={{ flexGrow: 1, marginLeft: 20, marginTop: 20 }}>
				<BlockNoteView onChange={onContentChanged} theme={'light'} editor={editor} editable={true} />
			</div>
		</div>
	)
}