import { useState } from "react"

export const useInputChange = (defaultData) => {
    const [input, setInput] = useState(defaultData)
    const handleChange = (e) => {
        let { value, name } = e.target
        setInput((prev) => ({ ...prev, [name]: value }))
    }
    return { input, handleChange }
}