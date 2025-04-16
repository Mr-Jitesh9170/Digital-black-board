import { Canva } from "../components/canva";
import Sidebar from "../components/sidebar";

const Notes = () => {
    return (
        <div className="notesContainer box-border flex">
            <Sidebar />
            <Canva />
        </div>
    )
}

export default Notes; 