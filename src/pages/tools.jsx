import { useCallback, useRef, useState } from "react";
import { UndoDot, RedoDot, Eraser, ArrowDownToLine, CirclePlus, CircleX, Trash } from 'lucide-react';

const Tools = ({ setLines, setHistory, linesRef, setIsErasing, isErasing, handleChange, input, canvasRef }) => {
    const colorRef = useRef(null);
    const [tools, setTools] = useState({ isWrap: false });
    const undoHandler = useCallback(() => {
        setLines(prev => {
            if (!prev.length) return prev;
            const updated = [...prev];
            const popped = updated.pop();
            setHistory(h => [...h, popped]);
            linesRef.current = updated;
            return updated;
        });
    }, []);
    const redoHandler = useCallback(() => {
        setHistory(prev => {
            if (!prev.length) return prev;
            const updated = [...prev];
            const restored = updated.pop();
            setLines(l => {
                const newLines = [...l, restored];
                linesRef.current = newLines;
                return newLines;
            });
            return updated;
        });
    }, []);
    const clearAll = () => {
        setLines([])
    }
    const downloadHandler = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const imageType = 'jpeg';
        const link = document.createElement('a');
        link.download = `my-drawing-${new Date().toLocaleString()}.png`;
        link.href = canvas.toDataURL(imageType);
        link.click();
    }
    const deleteHandler = useCallback(() => setIsErasing(prev => !prev), []);
    const colorPickerHandler = useCallback(() => colorRef.current.click(), []);
    const toolsHideHandler = useCallback(() => {
        setTools(prev => ({ ...prev, isWrap: !prev.isWrap }));
    }, []);
    return (
        <div className="absolute top-1 left-1  bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 p-[2px] rounded-2xl shadow-[0_0_25px_4px_rgba(255,100,255,0.5)]">
            <div className={`bg-white/90 backdrop-blur-sm  shadow-inner ${tools.isWrap ? "max-w-10 h-10 rounded-full" : "p-2 gap-2 rounded-xl"} flex flex-col`}>
                <div className='m-auto cursor-pointer' onClick={toolsHideHandler}>
                    {tools.isWrap ? <CirclePlus className='hover:text-blue-500' size={30} /> : <CircleX size={30} className='hover:text-red-800' />}
                </div>
                <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${tools.isWrap ? 'max-h-0 opacity-0 scale-y-90 translate-y-2' : 'max-h-[500px] opacity-100 scale-y-100 translate-y-0'}`}>
                    <button onClick={undoHandler} className="flex items-center justify-center text-sm text-gray-700 hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg">
                        <UndoDot size={18} />
                        <span className="ml-1 text-sm">Undo</span>
                    </button>
                    <button onClick={redoHandler} className="flex items-center justify-center text-sm text-gray-700 hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg">
                        <RedoDot size={18} />
                        <span className="ml-1 text-sm">Redo</span>
                    </button>
                    <button onClick={deleteHandler} className={`flex items-center justify-center text-sm ${isErasing ? 'text-red-500' : 'text-gray-700'} hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg`}>
                        <Eraser size={18} />
                        <span className="ml-1 text-sm">Erase</span>
                    </button>
                    <button onClick={clearAll} className={`flex items-center justify-center text-sm hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg`}>
                        <Trash size={18} />
                        <span className="ml-1 text-sm">Clear</span>
                    </button>
                    <div className="flex items-center justify-center">
                        <input
                            name="color"
                            ref={colorRef}
                            type="color"
                            value={input.color}
                            onChange={handleChange}
                            className="w-10 h-10 border border-gray-300 rounded-md shadow-sm"
                        />
                        <button onClick={colorPickerHandler} className="ml-1 text-sm text-gray-700 hover:text-violet-600 p-2 rounded-lg shadow-md hover:shadow-lg">
                            Color
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center ml-1 text-sm">
                        <input
                            name="pencilLineWidth"
                            type="range"
                            value={input.pencilLineWidth}
                            onChange={handleChange}
                            min={1}
                            max={20}
                            className="w-24"
                        />
                        <span>{input.pencilLineWidth}px</span>
                    </div>
                    <ArrowDownToLine onClick={downloadHandler} size={28} className='m-auto border-2 border-dotted rounded-4xl p-1 bg-black text-white cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

export default Tools