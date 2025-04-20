import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UndoDot, RedoDot, Eraser, LetterText } from 'lucide-react';
import { useInputChange } from '../hooks/inputeChange';

export const Canva = () => {
    const canvasRef = useRef(null);
    const colorRef = useRef(null);
    const [isDraw, setDraw] = useState(false);
    const [lines, setLines] = useState([]);
    const [history, setHistory] = useState([]);
    const { input, handleChange } = useInputChange({
        color: '#fff',
        pencilLineWidth: 2
    });

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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
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

        const getOffset = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return {
                    offsetX: e.touches[0].clientX - rect.left,
                    offsetY: e.touches[0].clientY - rect.top
                };
            } else {
                return {
                    offsetX: e.offsetX,
                    offsetY: e.offsetY
                };
            }
        };

        const startDrawing = (e) => {
            e.preventDefault();
            setDraw(true);
            const { offsetX, offsetY } = getOffset(e);
            setLines((prev) => [...prev, {
                x: offsetX,
                y: offsetY,
                color: input.color,
                pencilLineWidth: input.pencilLineWidth,
                path: []
            }]);
            setHistory([]);
        };

        const draw = (e) => {
            if (!isDraw) return;
            e.preventDefault();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                const { offsetX, offsetY } = getOffset(e);
                setLines((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].path.push({ x: offsetX, y: offsetY, color: input.color, pencilLineWidth: input.pencilLineWidth });

                    const currentLine = updated[updated.length - 1];
                    ctx.beginPath();
                    ctx.moveTo(currentLine.x, currentLine.y);
                    currentLine.path.forEach((point) => {
                        ctx.lineWidth = point.pencilLineWidth;
                        ctx.strokeStyle = point.color;
                        ctx.lineTo(point.x, point.y);
                    });
                    ctx.stroke();

                    return updated;
                });
            });
        };

        const stopDrawing = (e) => {
            e?.preventDefault();
            setDraw(false);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing, { passive: false });
        canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
            canvas.removeEventListener('touchcancel', stopDrawing);
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
        if (!lines.length) return;
        setLines((prevLines) => {
            let data = [...prevLines];
            data.pop();
            return data;
        });
    };

    const colorPickerHandler = () => {
        colorRef.current.click();
    };

    return (
        <div className="relative flex justify-center items-center">
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-4 flex flex-col gap-4">
                <button onClick={undoHandler} className="flex items-center justify-center text-sm text-gray-700 hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg">
                    <UndoDot size={24} />
                    <span className="ml-2">Undo</span>
                </button>
                <button onClick={redoHandler} className="flex items-center justify-center text-sm text-gray-700 hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg">
                    <RedoDot size={24} />
                    <span className="ml-2">Redo</span>
                </button>
                <button onClick={deleteHandler} className="flex items-center justify-center text-sm text-gray-700 hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg">
                    <Eraser size={24} />
                    <span className="ml-2">Erase</span>
                </button>
                <div className="flex items-center justify-center">
                    <input
                        name="color"
                        ref={colorRef}
                        type="color"
                        value={input.color}
                        onChange={handleChange}
                        className="w-12 h-12 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button onClick={colorPickerHandler} className="ml-2 text-sm text-gray-700 hover:text-violet-600 p-2 rounded-lg shadow-md hover:shadow-lg">
                        <span>Color</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <input
                        name="pencilLineWidth"
                        type="range"
                        value={input.pencilLineWidth}
                        onChange={handleChange}
                        min={1}
                        max={20}
                        className="w-24 mb-2"
                    />
                    <span>{input.pencilLineWidth}px</span>
                </div>
                <button className="flex items-center justify-center text-sm text-gray-700 hover:text-violet-600 transition p-2 rounded-lg shadow-md hover:shadow-lg">
                    <LetterText size={24} />
                    <span className="ml-2">Write</span>
                </button>
            </div>
            <canvas
                ref={canvasRef}
                style={{ display: 'block', cursor: 'crosshair', touchAction: 'none' }}
                className="bg-black w-full h-full"
            />
        </div>
    );
};