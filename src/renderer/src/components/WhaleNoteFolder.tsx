import { useState, ComponentProps } from 'react';
import { FaChevronRight } from "react-icons/fa";
import WhaleNoteFile from './WhaleNoteFile';
import { WhaleNoteFolderInfo } from './shared'

export type WhaleNoteFolderProps = ComponentProps<'div'> & WhaleNoteFolderInfo;

export default function WhaleNoteFolder({ title, childNotes, folderId, className, ...props }: WhaleNoteFolderProps) {
  const [isOpened, setIsOpened] = useState(false);

  return <div className='whale-note-folder'>
    <div className={className} {...props} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      onClick={() => setIsOpened(!isOpened)}>
      <div className='whale-note-folder-header' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }}>

        <FaChevronRight size={16} color='gray' className={isOpened ? 'whale-note-folder-arrow opened' : 'whale-note-folder-arrow'} />
        <div style={{ marginLeft: '14px', whiteSpace: 'nowrap', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }} className='btn-text'>{title}</div>

      </div>

    </div>

    {(isOpened && childNotes) && (
      <div style={{ height: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', borderLeft: '1.5px solid gray', marginLeft: '8px' }}>
        {/* {childNotes?.map((note, index) => <WhaleNoteFile key={index} content={note.content} />)} */}
      </div>
    )}
  </div>
}
