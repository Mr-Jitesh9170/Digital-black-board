import { BrowserRouter, Route, Routes } from "react-router-dom"
import Notes from "./pages/notes"
import Sidebar from "./components/sidebar"

BrowserRouter
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App 