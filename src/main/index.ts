import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'

require('dotenv').config()

function getRandomImage() {
    const res = async () => {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=ocean,whales,sky,sunset,dolphins&orientation=landscape&client_id=${process.env.UNSPLASH_KEY}`);
        const data = await response.json();
        const url = data.urls.full;
        return url;
    }

    return res();
}

function saveFile(fileContent) {
  const fileContentObject = JSON.parse(fileContent)
  // {
  //   fileId: fileid.current,
  //   metadata: {
  //     title: title.current,
  //     parentId: currentNote.metadata.parentId,
  //     backgroundUrl: currentNote.metadata.backgroundUrl,
  //     createdAt: currentNote.metadata.createdAt
  //   },
  //   content: JSON.stringify(currentContent.current),
  // }

  const stringData = fileContentObject.content
  
  const metadata = {
    title: fileContentObject.metadata.title,
    parentId: fileContentObject.metadata.parentId,
    backgroundUrl: fileContentObject.metadata.backgroundUrl,
    createdAt: fileContentObject.metadata.createdAt
  }
  
  const savePath = path.join(app.getPath('appData'), `notes/${fileContentObject.fileId}.json`)
  const saveMetadataPath = path.join(app.getPath('appData'), `metadata/${fileContentObject.fileId}.json`)

  fs.writeFile(savePath, stringData, (err) => {
    if(err) {
      console.log('Error while writing' + err)
    } else {
      console.log(fileContentObject)
      console.log('File is saved at ' + savePath)
    }
  })

  fs.writeFile(saveMetadataPath, JSON.stringify(metadata, null, 2), (err) => {
    if(err) {
      console.log('Error while writing' + err)
    } else {
      console.log(fileContentObject)
      console.log('File is saved at ' + savePath)
    }
  })
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    },
    title: 'Whales'
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  globalShortcut.register('CommandOrControl+Shift+S', () => {
    // Send an IPC message to the renderer process when the shortcut is pressed
    mainWindow.webContents.send('save-file-triggered', 'Save Shortcut Activated!');
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  
  ipcMain.handle('get-random-image', () => {
    return getRandomImage()
  })

  ipcMain.on('save-file', (event, fileContent) => {
    saveFile(fileContent)
  })

  ipcMain.on('create-file', (event, fileContent) => {

    // {
    //   fileId: newSideBarNote.fileId,
    //   title: 'Untitled Note',
    //   parentId: 0,
    //   backgroundUrl: 'none',
    //   createdAt: 0,
    //   content: newSideBarNote.content,
    // }
    const fileObject = JSON.parse(fileContent)
    const createPath = path.join(app.getPath('appData'), `notes/${fileObject.fileId}.json`)
    const createMetadataPath = path.join(app.getPath('appData'), `metadata/${fileObject.fileId}.json`)
    const dirPath = path.join(app.getPath('appData'), `notes`)
    const metadataDirPath = path.join(app.getPath('appData'), `metadata`)

    const metadata = {
      title: fileObject.title,
      parentId: fileObject.parentId,
      backgroundUrl: fileObject.backgroundUrl,
      createdAt: fileObject.createdAt
    }
    
    fs.access(dirPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            return;
          }
          
          fs.writeFile(createPath, '[]', (err) => {
            if(err) {
              console.log('Error while writing' + err)
            } else {
              console.log('File is saved at ' + createPath)
            }
          })
        });
      } else {

        fs.stat(dirPath, (err, stats) => {
          if (err) {
            console.error('Error checking directory:', err);
            return;
          }

          if (stats.isDirectory()) {
            
            fs.writeFile(createPath, '[]', (err) => {
              if(err) {
                console.log('Error while writing' + err)
              } else {
                console.log('File is saved at ' + createPath)
              }
            })

          } else {
            console.log('Path exists but is not a directory.');
          }
        });
      }
    });

    fs.access(metadataDirPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(metadataDirPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            return;
          }
          
          fs.writeFile(createMetadataPath, JSON.stringify(metadata, null, 2), (err) => {
            if(err) {
              console.log('Error while writing' + err)
            } else {
              console.log('Metadata File is saved at ' + createMetadataPath)
            }
          })

        });
      } else {

        fs.stat(metadataDirPath, (err, stats) => {
          if (err) {
            console.error('Error checking directory:', err);
            return;
          }

          if (stats.isDirectory()) {
            
            fs.writeFile(createMetadataPath, JSON.stringify(metadata, null, 2), (err) => {
              if(err) {
                console.log('Error while writing' + err)
              } else {
                console.log('Metadata File is saved at ' + createMetadataPath)
              }
            })

          } else {
            console.log('Path exists but is not a directory.');
          }
        });
      }
    });
    
  })

  ipcMain.handle('load-file', (event, fileID) => {
    const filePath = path.join(app.getPath('appData'), `notes/${fileID}.json`)

    const content = fs.promises.readFile(filePath, 'utf8')

    return content
  })

  ipcMain.handle('load-metadata-file', (event, fileId) => {
    // const fileObject = JSON.parse(fileId)
    const metadataFilePath = path.join(app.getPath('appData'), `metadata/${fileId}.json`)

    const content = fs.promises.readFile(metadataFilePath, 'utf8')
    return content
  })

  ipcMain.handle('remove-file', (event, fileID) => {
    const filePath = path.join(app.getPath('appData'), `notes/${fileID}.json`)
    const metadataFilePath = path.join(app.getPath('appData'), `metadata/${fileID}.json`)
    fs.unlink(filePath, (err) => {
      if(err) {
        console.log(err)
      }
    })
    fs.unlink(metadataFilePath , (err) => {
      if(err) {
        console.log(err)
      }
    })
  })

  ipcMain.handle('get-files', async (event) => {
    const notesPath = path.join(app.getPath('appData'), 'notes'); // Folder containing files
    let filesData: {fileId: number, content: string}[] = [];
  
    try {
      const files = await fs.promises.readdir(notesPath);
       
      // Read the content of each file
      for (const file of files) {
        const [id, ext] = file.split('.');
        const filePath = path.join(notesPath, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        filesData.push({fileId: parseInt(id, 10), content: content});
      }
    } catch (error) {
      console.error('Error reading files:', error);
      return []; // Return empty array on error
    }
  
    return filesData; // Return all file contents to the renderer
  });

  ipcMain.handle('get-metadata-files', async (event) => {
    const notesPath = path.join(app.getPath('appData'), 'metadata'); // Folder containing files
    let filesMetadaData: {title: string, parentId?: number, backgroundUrl?: string, createdAt?: number}[] = [];
  
    try {
      const files = await fs.promises.readdir(notesPath);
       
      // Read the content of each file
      for (const file of files) {
        const [id, ext] = file.split('.');
        const filePath = path.join(notesPath, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const contentJson = JSON.parse(content);
        filesMetadaData.push({title: contentJson.title, parentId: parseInt(contentJson.parentId, 10),
           backgroundUrl: contentJson.backgroundUrl, createdAt: Date.parse(contentJson.createdAt)});
      }
    } catch (error) {
      console.error('Error reading files:', error);
      return []; // Return empty array on error
    }
  
    return filesMetadaData; // Return all file contents to the renderer
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globalShortcut.unregisterAll();
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
