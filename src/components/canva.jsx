import React, { lazy, useEffect, useRef, useState } from 'react';
import { useInputChange } from '../hooks/inputeChange';
const Tools = lazy(() => import('../pages/tools'))

const Canva = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const linesRef = useRef([]);
    const [isDraw, setDraw] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [lines, setLines] = useState([]);
    const [history, setHistory] = useState([]);
    const { input, handleChange } = useInputChange({
        color: '#fff',
        pencilLineWidth: 1
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;
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
    return (
        <div className="w-screen h-screen">
            <Tools setLines={setLines} setHistory={setHistory} linesRef={linesRef} setIsErasing={setIsErasing} isErasing={isErasing} handleChange={handleChange} input={input} canvasRef={canvasRef} />
            <canvas
                ref={canvasRef}
                className={`bg-black w-full h-full block touch-none ${isErasing ? 'cursor-cell' : 'cursor-crosshair'}`}
            />
        </div>
    );
};

export default Canva