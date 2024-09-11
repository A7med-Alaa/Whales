import { ComponentProps, useEffect, useRef } from 'react';
import { WhaleNoteFileInfo, WhaleNoteFileMetadata } from './shared';
import { useAtom } from 'jotai';
import { currentMetadataNoteAtom, currentNoteAtom } from './globals';


export type WhaleNoteFileProps = ComponentProps<'div'> & WhaleNoteFileInfo;

export default function WhaleNoteFile({ fileId, title, ...props }: WhaleNoteFileProps) {
  const [currentNote, setCurrentNote] = useAtom(currentNoteAtom)
  const [currentMetadata, setCurrentMetadata] = useAtom(currentMetadataNoteAtom)

  async function onNoteClicked() {

    // @ts-ignore
    const contentData = await window.electron.loadFileLocal(fileId)
    setCurrentNote({ fileId, content: contentData })

    // @ts-ignore
    const metadataContent = await window.electron.loadMetadataFile(fileId)
    setCurrentMetadata(JSON.parse(metadataContent))
  }

  return <div className={'whale-note-file'} {...props} onClick={onNoteClicked} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }}>
    <div style={{ marginLeft: '35px' }} className='btn-text'>{title}</div>
  </div>;
}
