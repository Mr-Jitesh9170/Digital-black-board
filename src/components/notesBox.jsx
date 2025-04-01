import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

const NotesContainer = () => {
    const [noteContainer, setNoteContainer] = useState(
        {
            isNotesbarOpen: false
        }
    )
    const isOpesidebarHandler = () => {
        setNoteContainer({ ...noteContainer, isNotesbarOpen: !noteContainer.isNotesbarOpen })
    }
    return (
        <div onClick={isOpesidebarHandler}>
            <div className="flex">
                {noteContainer.isNotesbarOpen ? <ChevronDown /> : <ChevronRight />}
                <div>notes-1</div>
            </div>
            <div>I am the Notes-1</div>
        </div>

    )
}

export default NotesContainer