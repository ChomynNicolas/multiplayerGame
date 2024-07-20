import React, { useRef, useEffect } from "react";
import styles from "./Canvas.module.css";

const Canvas = ({ dibujando, setDibujando, puntos, setPuntos, socket, loadingPalabra, Rondas, poderDibujar }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    socket.on("server:dibujando", (data) => {
      const context = contextRef.current;
      context.beginPath();
      context.moveTo(data[0].x, data[0].y);
      data.forEach((point) => {
        context.lineTo(point.x, point.y);
        context.stroke();
      });
      context.closePath();
    });

    socket.on("server:color", (color) => {
      contextRef.current.strokeStyle = color;
    });

    socket.on("server:option", (data) => {
      contextRef.current.lineWidth = data.height;
      if (data.color) {
        contextRef.current.strokeStyle = data.color;
      }
    });

    socket.on("server:limpiar", () => {
      const canvas = canvasRef.current;
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("server:dibujando");
      socket.off("server:color");
      socket.off("server:option");
      socket.off("server:limpiar");
    };
  }, [socket]);

  const evtDibujaCanvas = (evt) => {
    if (!dibujando) return;
    const offsetX = evt.clientX - canvasRef.current.offsetLeft;
    const offsetY = evt.clientY - canvasRef.current.offsetTop;
    const newPoint = { x: offsetX, y: offsetY };
    setPuntos((prevPuntos) => {
      const updatedPuntos = [...prevPuntos, newPoint];
      socket.emit("client:dibujando", updatedPuntos);
      return updatedPuntos;
    });
  };

  const evtIniciaDibujo = (evt) => {
    if(!poderDibujar){
      return
    }
    setDibujando(true);
    const offsetX = evt.clientX - canvasRef.current.offsetLeft;
    const offsetY = evt.clientY - canvasRef.current.offsetTop;
    setPuntos([{ x: offsetX, y: offsetY }]);
  };

  const evtTerminaDibujo = () => {
    setDibujando(false);
    setPuntos([]);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black" }}
      onMouseDown={evtIniciaDibujo}
      onMouseMove={evtDibujaCanvas}
      onMouseUp={evtTerminaDibujo}
      className={styles.canvaStyle}
    ></canvas>
  );
};

export default Canvas;
