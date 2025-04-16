import React, { useEffect, useRef, useState } from 'react';

export const Canva = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState([]);  // Store all drawn lines

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set up drawing settings
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        // Draw the lines stored in `lines`
        const drawLines = () => {
            lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line[0].x, line[0].y);
                line.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            });
        };

        // Call the drawLines function to redraw all lines
        drawLines();

        const startDrawing = (e) => {
            const newLine = [{ x: e.offsetX, y: e.offsetY }];
            setLines([...lines, newLine]);  // Start a new line
            setIsDrawing(true);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const newPoint = { x: e.offsetX, y: e.offsetY };
            const updatedLines = [...lines];
            updatedLines[updatedLines.length - 1].push(newPoint);  // Add point to the current line
            setLines(updatedLines);  // Update the state
        };

        const stopDrawing = () => {
            setIsDrawing(false);
        };

        // Set up event listeners
        const canvasEl = canvasRef.current;
        canvasEl.addEventListener('mousedown', startDrawing);
        canvasEl.addEventListener('mousemove', draw);
        canvasEl.addEventListener('mouseup', stopDrawing);
        canvasEl.addEventListener('mouseleave', stopDrawing);

        return () => {
            canvasEl.removeEventListener('mousedown', startDrawing);
            canvasEl.removeEventListener('mousemove', draw);
            canvasEl.removeEventListener('mouseup', stopDrawing);
            canvasEl.removeEventListener('mouseleave', stopDrawing);
        };
    }, [isDrawing, lines]);  // Re-run the effect when lines change

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', cursor:"cell" }}
            className="  border-black bg-amber-200 w-10/12 overflow-y-auto"
        />
    );
};
