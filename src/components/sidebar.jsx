import { ChevronDown, ChevronRight, FilePlus, FolderPlus } from "lucide-react"
import { useState } from "react"
import NotesContainer from "./notesBox"

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(
        {
            isSidebarOpen: true
        }
    )

    const isOpesidebarHandler = () => {
        setSidebar({ ...sidebar, isSidebarOpen: !sidebar.isSidebarOpen })
    }
    return (
        <div className="notesLeft w-2/12 bg-amber-100 h-lvh">
            <div className="headerSection"></div>
            <div className="herosection">
                <div className="border p-0 flex justify-between align-bottom" onClick={isOpesidebarHandler}>
                    <div className="flex">
                        {sidebar.isSidebarOpen ? <ChevronDown /> : <ChevronRight />}
                        <div className="text-md font-bold">Notes</div>
                    </div>
                    <div className="flex align-middle gap-1">
                        <FolderPlus size={20} />
                        <FilePlus size={20} />
                    </div>
                </div>
                {
                    sidebar.isSidebarOpen && (
                        <div className="border p-1 text-amber-700">
                            <NotesContainer />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Sidebar