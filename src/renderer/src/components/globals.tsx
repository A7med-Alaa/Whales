import { atom } from "jotai"
import { WhaleNoteFileInfo, WhaleNoteFileMetadata } from "./shared"

const noteFiles: WhaleNoteFileInfo[] = []
const emptyNote: WhaleNoteFileInfo = {
    fileId: 0,
    content: '[{}]',
}

const noteMetadataFiles: WhaleNoteFileMetadata[] = []
const emptyMetadata: WhaleNoteFileMetadata = {
    title: 'Untitled Note',
    parentId: 0,
    backgroundUrl: 'none',
    createdAt: 0
}

export const currentNoteAtom = atom(emptyNote)
export const currentMetadataNoteAtom = atom(emptyMetadata)
export const noteFilesAtom = atom(noteFiles)
export const noteFilesMetadataAtom = atom(noteMetadataFiles)