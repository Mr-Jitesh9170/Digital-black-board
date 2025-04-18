import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UndoDot, RedoDot, Eraser } from 'lucide-react';
import { useInputChange } from '../hooks/inputeChange';


export const Canva = () => {
    const canvasRef = useRef(null);
    const colorRef = useRef(null)
    const [isDraw, setDraw] = useState(false);
    const [lines, setLines] = useState([]);
    const [history, setHistory] = useState([]);
    const { input, handleChange } = useInputChange(
        {
            color: '#fff',
            pencilLineWidth: 2
        }
    )


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        const drawLine = (line) => {
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            line.path.forEach((p) => {
                ctx.lineWidth = p.pencilLineWidth;
                ctx.strokeStyle = p.color;
                ctx.lineTo(p.x, p.y)
            });
            ctx.stroke();
        };
        const redrawCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lines.forEach(drawLine);
        };
        redrawCanvas();
    }, [lines]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        let animationFrameId;

        const startDrawing = (e) => {
            setDraw(true);
            const { offsetX, offsetY } = e;
            setLines((prev) => [...prev, { x: offsetX, y: offsetY, color: input.color, pencilLineWidth: input.pencilLineWidth, path: [] }]);
            setHistory([]);
        };

        const draw = (e) => {
            if (!isDraw) return;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                const { offsetX, offsetY } = e;
                setLines((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].path.push({ x: offsetX, y: offsetY, color: input.color, pencilLineWidth: input.pencilLineWidth, });
                    const currentLine = updated[updated.length - 1];
                    ctx.beginPath();
                    ctx.moveTo(currentLine.x, currentLine.y);
                    currentLine.path.forEach((point) => {
                        ctx.lineWidth = input.pencilLineWidth;
                        ctx.strokeStyle = point.color;
                        ctx.lineTo(point.x, point.y)
                    });
                    ctx.stroke();
                    return updated;
                });
            });
        };

        const stopDrawing = () => setDraw(false);

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
        };
    }, [isDraw, input]);

    const undoHandler = useCallback(() => {
        if (!lines.length) return;
        const newLines = [...lines];
        const popped = newLines.pop();
        setLines(newLines);
        setHistory([...history, popped]);
    }, [lines, history]);

    const redoHandler = useCallback(() => {
        if (!history.length) return;
        const newHistory = [...history];
        const restored = newHistory.pop();
        setHistory(newHistory);
        setLines([...lines, restored]);
    }, [lines, history]);

    const deleteHandler = () => {
        if (!lines.length)
            return
        setLines((prevLines) => {
            let data = [...prevLines]
            data.pop()
            return data
        })
    }
    const colorPickerHandler = () => {
        colorRef.current.click()
    }

    return (
        <div className="relative flex justify-center">
            <div className="canvaOperation px-3 py-2 flex gap-1  absolute bg-white rounded-sm mt-3 border-dotted">
                <div className="undo flex justify-between flex-col  p-1 shadow-sm rounded-sm cursor-pointer" onClick={undoHandler}>
                    <UndoDot size={20} className='m-auto' />
                    <span className="bg-black hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700  px-1 py-0.5 rounded-sm text-sm text-white font-semibold ">Undo</span>
                </div>
                <div className="redo  flex justify-between flex-col  p-1 shadow-sm rounded-sm cursor-pointer" onClick={redoHandler}>
                    <RedoDot className="m-auto" size={20} />
                    <span className="bg-black hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700  px-1 py-0.5 rounded-sm text-sm text-white font-semibold ">Redo</span>
                </div>
                <div className="eraser  flex justify-between flex-col  p-1 shadow-sm rounded-sm cursor-pointer" onClick={deleteHandler}>
                    <Eraser className="m-auto" size={20} />
                    <span className="bg-black hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700  px-1 py-0.5 rounded-sm text-sm text-white font-semibold ">Eraser</span>
                </div>
                <div className="color  p-1 shadow-sm rounded-sm cursor-pointer  flex justify-between flex-col ">
                    <input
                        name="color"
                        size={20}
                        ref={colorRef}
                        type="color"
                        value={input.color}
                        onChange={handleChange}
                        className='m-auto'
                    />
                    <span onClick={colorPickerHandler} className="bg-black hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 px-2 py-1 rounded-sm text-sm text-white font-semibold">
                        Color
                    </span>
                </div>
                <div className="color p-1 shadow-sm rounded-sm cursor-pointer  flex justify-between flex-col ">
                    <input
                        name="pencilLineWidth"
                        size={20}
                        type="range"
                        className='m-auto'
                        value={input.pencilLineWidth}
                        onChange={handleChange}
                    />
                    <span className="bg-black hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 px-2 py-1 rounded-sm text-sm text-white font-semibold">
                        Pencil thickness
                    </span>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ display: 'block', cursor: 'crosshair' }}
                className="bg-black border-amber-100"
            />
        </div>
    );
};
