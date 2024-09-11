import { useAtom } from 'jotai'
import ContentPage from './components/ContentPage'
import { currentNoteAtom } from './components/globals'
import SideBar from './components/SideBar'

function App(): JSX.Element {
  const [currentNote] = useAtom(currentNoteAtom)

  return (
    <div className="AppLayout">
      <SideBar />
      <ContentPage hide={currentNote.fileId === 0 ? true : false} />
    </div>
  )
}

export default App
