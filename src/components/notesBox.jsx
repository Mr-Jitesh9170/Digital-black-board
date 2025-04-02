import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

const NotesContainer = ({ folderName, fileList }) => {
    const [noteContainer, setNoteContainer] = useState(
        {
            isNotesbarOpen: false
        }
    )
    const isOpesidebarHandler = () => {
        setNoteContainer({ ...noteContainer, isNotesbarOpen: !noteContainer.isNotesbarOpen })
    }
    return (
        <div className="border text-amber-700 flex flex-col cursor-pointer" onClick={isOpesidebarHandler}>
            <div className="flex">
                {noteContainer.isNotesbarOpen ? <ChevronDown /> : <ChevronRight />}
                <div>{folderName}</div>
            </div>
            {
                noteContainer.isNotesbarOpen && (
                    <ul>
                        {
                            fileList.map((fileData) => {
                                return <li className="border-t-1 px-6">{fileData.fileName}</li>
                            })
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default NotesContainer