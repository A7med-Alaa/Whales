import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      getRandomImage: () => ipcRenderer.invoke('get-random-image'),
      onSaveFileShortcut: (callback) => ipcRenderer.on('save-file-triggered', callback),
      saveFileLocal: (fileContent) => ipcRenderer.send('save-file', fileContent),
      createFileLocal: (fileContent) => ipcRenderer.send('create-file', fileContent),
      loadFileLocal: (fileId) => ipcRenderer.invoke('load-file', fileId),
      loadMetadataFile: (fileId) => ipcRenderer.invoke('load-metadata-file', fileId),
      loadAllFiles: () => ipcRenderer.send('load-all-files'),
      removeFileAndMetadata: (fileId) => ipcRenderer.invoke('remove-file', fileId),
      loadAllMetadataFiles: () => ipcRenderer.send('load-all-metadata-files'),
      getFiles: () => ipcRenderer.invoke('get-files'),
      getMetadataFiles: () => ipcRenderer.invoke('get-metadata-files'),
      onAllFilesLoaded: (callback: (data: string) => void) => ipcRenderer.on('loaded-all-files', (event, data) => callback(data)),
      onAllMetadataFilesLoaded: (callback: (data: string) => void) => ipcRenderer.on('loaded-all-metadata-files', (event, data) => callback(data)),
      onFileContents: (callback: (data: string) => void) => ipcRenderer.on('loaded-file-content', (event, data) => callback(data)),
      onMetadataFileContents: (callback: (data: string) => void) => ipcRenderer.on('loaded-metadata-file-content', (event, data) => callback(data))
    })
    
  } catch (error) {
    console.error(error)
  }
} else {
  // // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
