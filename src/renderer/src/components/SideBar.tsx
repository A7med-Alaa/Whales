import { useRef, useEffect, useState } from 'react';
import { SlSettings } from "react-icons/sl";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { IoIosRefresh } from "react-icons/io";

import WhaleNoteFile from './WhaleNoteFile';
import { WhaleNoteFileInfo } from './shared';
import { useAtom } from 'jotai';
import { currentMetadataNoteAtom, currentNoteAtom, noteFilesAtom, noteFilesMetadataAtom } from './globals';
import FileContextMenu from './FileContextMenu';

export default function SideBar() {
  const resizerRef = useRef(null);
  const sidebarRef = useRef(null);

  const [sideBarMinimized, setSideBarMinimized] = useState(false);
  const [notes, setNotes] = useAtom(noteFilesAtom);
  const [notesMetadata, setNotesMetadata] = useAtom(noteFilesMetadataAtom);
  const [currentNote, setCurrentNote] = useAtom(currentNoteAtom);
  const [currentMetadata, setCurrentMetadata] = useAtom(currentMetadataNoteAtom);
  // const minimumSideBarWidth = 213;
  // const maximumSideBarWidth = window.innerWidth * 0.7;

  const maximizeSideBarWidth = window.innerWidth * 0.2;

  function whenMinizingFinishs() {
    (sidebarRef.current! as HTMLElement).classList.add('minimized');
    (sidebarRef.current! as HTMLElement).removeEventListener('transitionend', whenMinizingFinishs);
  }

  function minimizeSideBar() {
    setSideBarMinimized(true);
    (sidebarRef.current! as HTMLElement).style.transition = 'background 0.5s ease, width 0.15s ease-in-out';
    (sidebarRef.current! as HTMLElement).style.width = '40px';

    (sidebarRef.current! as HTMLElement).addEventListener('transitionend', whenMinizingFinishs);
  }

  function maximizeSideBar() {
    setSideBarMinimized(false);
    (sidebarRef.current! as HTMLElement).style.transition = 'background 0.15s ease, width 0.15s ease-in-out';
    (sidebarRef.current! as HTMLElement).style.width = maximizeSideBarWidth + 'px';

    (sidebarRef.current! as HTMLElement).classList.remove('minimized');
  }

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
    let x, width;
    const styles = window.getComputedStyle(sidebarRef.current!);
    width = parseInt(styles.width, 10);
    x = 0;

    function startDragging(e) {
      width = e.clientX;
      (sidebarRef.current! as HTMLElement).style.width = `${width}px`;
    }

    function onMouseUp(e) {
      document.removeEventListener('mousemove', startDragging);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseDown(e) {
      x = e.clientX;
      (sidebarRef.current! as HTMLElement).style.transition = 'none';
      document.addEventListener('mousemove', startDragging);
      document.addEventListener('mouseup', onMouseUp);
    }

    // (resizerRef.current! as HTMLElement).addEventListener('mousedown', onMouseDown);

    refreshFiles()
    return () => {
      (resizerRef.current! as HTMLElement).removeEventListener('mousedown', onMouseDown);
    }
  }, [])

  function createANewNote() {
    // console.log(notesMetadata)
    const newSideBarNote: WhaleNoteFileInfo = {
      fileId: Math.floor(Math.random() * (1000000 - 1 + 1)) + 1,
      content: '[{}]',
    }

    const newFileNote = {
      fileId: newSideBarNote.fileId,
      title: 'Untitled Note',
      parentId: 0,
      backgroundUrl: 'none',
      createdAt: Date.now(),
      content: newSideBarNote.content,
    }

    const metadata = {
      title: newFileNote.title,
      parentId: newFileNote.parentId,
      backgroundUrl: newFileNote.backgroundUrl,
      createdAt: newFileNote.createdAt
    }
    // @ts-ignore
    window.electron.createFileLocal(JSON.stringify(newFileNote))
    setNotes([...notes, newSideBarNote])
    setNotesMetadata([...notesMetadata, metadata])
  }

  const [showFileContextMenu, setShowFileContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuItemIndex = useRef(0)
  function handleFileContextMenu(e, index) {
    setShowFileContextMenu(!showFileContextMenu)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    contextMenuItemIndex.current = index
  }

  async function deleteNote() {
    const note = notes[contextMenuItemIndex.current]
    // @ts-ignore
    await window.electron.removeFileAndMetadata(note.fileId)
    refreshFiles()
  }

  return (
    <div ref={sidebarRef} onClick={() => setShowFileContextMenu(false)} className="sidebar">
      <div ref={resizerRef} style={sideBarMinimized ? { display: 'none' } : {}} className="resizer"></div>

      <div className="toolBarBtnsContainer">

        <div className="toolBarLeftContainer">

          {sideBarMinimized ? (
            // Maximize
            <button onClick={maximizeSideBar} className="toolBarBtn">
              <FaAnglesRight className={'toolbar-btn-icon'} size={18} />
            </button>
          ) : (
            // Collapse
            <button onClick={minimizeSideBar} style={{ marginRight: 10 }} className="toolBarBtn">
              <FaAnglesLeft className={'toolbar-btn-icon'} size={18} />
            </button>
          )}


          <button onClick={refreshFiles} style={{ marginRight: 10, display: sideBarMinimized ? 'none' : 'flex' }} className="toolBarBtn">
            <IoIosRefresh className={'toolbar-btn-icon'} size={22} />
          </button>

        </div>

        <div className="toolBarRightContaier" style={sideBarMinimized ? { display: 'none' } : {}}>

          <button className="toolBarBtn" style={{ marginRight: 10 }}>
            <MdOutlineCreateNewFolder className={'toolbar-btn-icon'} size={24} />
          </button>

          <button onClick={createANewNote} className="toolBarBtn" style={sideBarMinimized ? { display: 'none' } : {}}>
            <VscNewFile className={'toolbar-btn-icon'} size={22} />
          </button>

        </div>

      </div>

      <div style={sideBarMinimized ? { display: 'none' } : { display: 'flex', flexDirection: 'column', height: '90%' }}>

        <div id="staticContent" style={{ width: '100%', marginTop: 10 }}>
          <button className="sidebarBtn">
            <SlSettings className={'btn-icon'} size={18} />
            <div className="btn-text">Settings</div>
          </button>
        </div>

        {notes.length > 0 ? <div style={{
          flexGrow: 1, marginTop: 25, marginLeft: 0, overflow: 'auto', height: '100%',
        }}>
          {notes?.map((note, index) => <WhaleNoteFile key={index} onContextMenu={(e) => handleFileContextMenu(e, index)}
            fileId={note.fileId} title={(notesMetadata[index] !== undefined && notesMetadata[index] !== null) ? notesMetadata[index].title : 'Untitled Note'} />)}
        </div>
          :
          <div style={{
            flexGrow: 1, letterSpacing: 0.7, marginTop: 25, marginLeft: 10,
            overflow: 'auto', height: '100%'
          }}>Start by Creating a New Note</div>}

      </div>

      {showFileContextMenu && <FileContextMenu onDelete={deleteNote} position={contextMenuPosition} />}

    </div >
  )
}
