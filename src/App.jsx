import { BrowserRouter, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"
const Canva = lazy(() => import("./components/canva"))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex justify-center items-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Canva />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App  