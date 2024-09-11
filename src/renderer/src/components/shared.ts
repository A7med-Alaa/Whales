export type WhaleNoteFolderInfo = {
  folderId: number,
  title: string,
  childNotes?: WhaleNoteFileInfo[],
}

export type WhaleNoteFileInfo = {
  fileId: number,
  content?: string,
}

export type WhaleNoteFileMetadata = {
  title: string,
  parentId?: number,
  backgroundUrl: string,
  createdAt: number
}
