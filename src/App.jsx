import { BrowserRouter, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"

const Notes = lazy(() => import("./pages/notes"))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex justify-center items-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Notes />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App  