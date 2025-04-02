import { BrowserRouter, Route, Routes } from "react-router-dom"
import Notes from "./pages/notes"
import Sidebar from "./components/sidebar"

BrowserRouter
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/notes" element={<Notes />} >
            <Route path="/notes/sidebar" element={<Sidebar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App 