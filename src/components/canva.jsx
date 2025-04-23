import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UndoDot, RedoDot, Eraser, ChevronsDown, ChevronsUp } from 'lucide-react';
import { useInputChange } from '../hooks/inputeChange';

export const Canva = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const colorRef = useRef(null);
    const linesRef = useRef([]);
    const [isDraw, setDraw] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [lines, setLines] = useState([]);
    const [history, setHistory] = useState([]);
    const { input, handleChange } = useInputChange({
        color: '#fff',
        pencilLineWidth: 2
    });
    const [tools, setTools] = useState({ isWrap: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            setLines((prev) => [...prev]);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    useEffect(() => {
        linesRef.current = lines;
    }, [lines]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;
    }, []);

    useEffect(() => {
        const ctx = ctxRef.current;
        ctx.lineCap = 'round';
        const drawLine = (line) => {
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            line.path.forEach((p) => {
                ctx.lineWidth = p.pencilLineWidth;
                ctx.strokeStyle = p.color;
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        };
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        lines.forEach(drawLine);
    }, [lines]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        ctx.lineCap = 'round';
        let animationFrameId;

        const getOffset = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                offsetX: x - rect.left,
                offsetY: y - rect.top
            };
        };

        const startDrawing = (e) => {
            e.preventDefault();
            setDraw(true);
            if (isErasing) return;
            const { offsetX, offsetY } = getOffset(e);
            linesRef.current.push({
                x: offsetX,
                y: offsetY,
                color: input.color,
                pencilLineWidth: input.pencilLineWidth,
                path: []
            });
            setHistory([]);
        };

        const draw = (e) => {
            if (!isDraw && !isErasing) return;
            e.preventDefault();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const { offsetX, offsetY } = getOffset(e);
                if (isErasing) {
                    linesRef.current = linesRef.current.filter(line =>
                        !line.path.some(point => (
                            Math.hypot(point.x - offsetX, point.y - offsetY) < 10
                        ))
                    );
                    setLines([...linesRef.current]);
                    return;
                }
                const currentLine = linesRef.current[linesRef.current.length - 1];
                currentLine.path.push({
                    x: offsetX,
                    y: offsetY,
                    color: input.color,
                    pencilLineWidth: input.pencilLineWidth
                });
                ctx.beginPath();
                ctx.moveTo(currentLine.x, currentLine.y);
                currentLine.path.forEach(point => {
                    ctx.lineWidth = point.pencilLineWidth;
                    ctx.strokeStyle = point.color;
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            });
        };
        const stopDrawing = (e) => {
            e?.preventDefault();
            setDraw(false);
            setLines([...linesRef.current]);
        };
        canvas.addEventListener('pointerdown', startDrawing);
        canvas.addEventListener('pointermove', draw);
        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointerleave', stopDrawing);
        return () => {
            canvas.removeEventListener('pointerdown', startDrawing);
            canvas.removeEventListener('pointermove', draw);
            canvas.removeEventListener('pointerup', stopDrawing);
            canvas.removeEventListener('pointerleave', stopDrawing);
        };
    }, [isDraw, input, isErasing]);
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
    const deleteHandler = useCallback(() => setIsErasing(prev => !prev), []);
    const colorPickerHandler = useCallback(() => colorRef.current.click(), []);
    const toolsHideHandler = useCallback(() => {
        setTools(prev => ({ ...prev, isWrap: !prev.isWrap }));
    }, []);
    return (
        <div className="relative flex justify-center items-center">
            <div className={`absolute top-4 right-4  bg-white/90 backdrop-blur-sm rounded-lg shadow-lg ${tools.isWrap ? "p-1" : "p-2  gap-2"} flex flex-col`}>
                <div className='border-2 font-bold border-dotted p-1 rounded-lg flex items-center justify-center gap-1 cursor-pointer' onClick={toolsHideHandler}>
                    {tools.isWrap ? <ChevronsUp size={17} /> : <ChevronsDown size={17} />}
                    <span>{tools.isWrap ? "Open" : "Close"}</span>
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
                </div>
            </div>
            <canvas
                ref={canvasRef}
                style={{ display: 'block', cursor: isErasing ? 'cell' : 'crosshair', touchAction: 'none' }}
                className="bg-black w-full h-full"
            />
        </div>
    );
};
