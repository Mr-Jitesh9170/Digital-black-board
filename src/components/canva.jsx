import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UndoDot, RedoDot } from 'lucide-react';

export const Canva = () => {
    const canvasRef = useRef(null);
    const [isDraw, setDraw] = useState(false);
    const [lines, setLines] = useState([]);
    const [history, setHistory] = useState([]);

    // Setup canvas and draw utilities
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#fff';

        const drawLine = (line) => {
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            line.path.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        };

        const redrawCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lines.forEach(drawLine);
        };

        redrawCanvas();

    }, [lines]);

    // Mouse handlers
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#fff';

        let animationFrameId;

        const startDrawing = (e) => {
            setDraw(true);
            const { offsetX, offsetY } = e;
            setLines((prev) => [...prev, { x: offsetX, y: offsetY, path: [] }]);
            setHistory([]); // clear redo history when drawing new
        };

        const draw = (e) => {
            if (!isDraw) return;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const { offsetX, offsetY } = e;
                setLines((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].path.push({ x: offsetX, y: offsetY });

                    // draw only the latest stroke to avoid redrawing all
                    const currentLine = updated[updated.length - 1];
                    ctx.beginPath();
                    ctx.moveTo(currentLine.x, currentLine.y);
                    currentLine.path.forEach((point) => ctx.lineTo(point.x, point.y));
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
    }, [isDraw]);

    // Undo Handler
    const undoHandler = useCallback(() => {
        if (!lines.length) return;
        const newLines = [...lines];
        const popped = newLines.pop();
        setLines(newLines);
        setHistory([...history, popped]);
    }, [lines, history]);

    // Redo Handler
    const redoHandler = useCallback(() => {
        if (!history.length) return;
        const newHistory = [...history];
        const restored = newHistory.pop();
        setHistory(newHistory);
        setLines([...lines, restored]);
    }, [lines, history]);

    return (
        <div className="relative flex justify-center">
            <div className="canvaOperation px-3 py-2 flex z-20 gap-2 absolute bg-white rounded-sm mt-3 border-dotted">
                <div className="undo p-1 shadow-sm rounded-sm cursor-pointer" onClick={undoHandler}>
                    <UndoDot className="m-auto" size={20} />
                    <span className="bg-black p-1 rounded-sm text-sm text-white">Undo</span>
                </div>
                <div className="redo p-1 shadow-sm rounded-sm cursor-pointer" onClick={redoHandler}>
                    <RedoDot className="m-auto" size={20} />
                    <span className="bg-black p-1 rounded-sm text-sm text-white">Redo</span>
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
