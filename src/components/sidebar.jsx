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
    const fileList = [
        {
            fileName: "index1.html" 
        },
        {
            fileName: "index2.html"
        },
        {
            fileName: "index3.html"
        },
        {
            fileName: "index4.html"
        },
        {
            fileName: "index5.html"
        }
    ]
    return (
        <div className="notesLeft w-2/12 bg-amber-100 h-lvh">
            <div className=""></div>
            <div className="">
                <div className="border p-0 flex justify-between align-bottom cursor-pointer hover:bg-violet-200 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700" onClick={isOpesidebarHandler}>
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
                        <div className="p-1">
                            <NotesContainer folderName={"Learn-html"} fileList={fileList} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Sidebar