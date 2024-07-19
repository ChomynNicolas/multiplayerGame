import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styles from './App.module.css'
const socket = io("http://localhost:4000");
import lapiz from './assets/lapiz.png'
import marcador from './assets/marcador.png'
import borrador from './assets/borrador.png'

function App() {
  const [word, setword] = useState([]);
  const [canvasContext, setCanvasContext] = useState(null);
  const [dibujando, setDibujando] = useState(false)
  const [puntos, setPuntos] = useState([])
  const [color, setcolor] = useState("black")
  const [cuadrado, setCuadrado] = useState(5)
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;
    const context = canvas.getContext("2d");
    setCanvasContext(context);
  }, []);

  useEffect(() => {
    socket.on("server:getword", (data) => {
      const random = Math.floor(Math.random() * data.length);
      const wordFilter = data.filter((data, ind) => ind === random);
      setword(wordFilter);
    });

    return () => {
      socket.off("server:getword");
    };
  }, []);

  const handleMove = () => {
    socket.emit("client:getword");
  };
  
  const evtDibujaCanvas = (e) =>{

    if(!dibujando) return
    const canvas = canvasRef.current
    
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    
    canvasContext.fillStyle = color;
    canvasContext.fillRect(mouseX,mouseY,cuadrado,cuadrado);
    
    setPuntos([...puntos,{x: mouseX, y: mouseY}])
    



  }

  const evtIniciaDibujo = (evt)=>{
    setDibujando(true)
    evtDibujaCanvas(evt)
  }

  const evtTerminaDibujo = (evt) =>{
    setDibujando(false)
    evtDibujaCanvas(evt)
    console.log(puntos)
    if(cuadrado===50){
      setCuadrado(5)
    }
  }
  
  const handleBorrador = ()=>{
    setCuadrado(50)
    setcolor("white")
  }

  
  return (
    <div>
      <div className={styles.elementsContainer}>
        <div className={styles.herramientContainer}>
          <img src={lapiz} alt="Lapiz" className={styles.imgHerramienta} />
          <img src={marcador} alt="marcador" className={styles.imgHerramienta} />
          <img src={borrador} alt="borrador" onClick={handleBorrador}  className={styles.imgHerramienta}/>

        </div>
        <div>
          <ul className={styles.colorContainer}>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "black"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "red"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "blue"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "green"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "yellow"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "cyan"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "brown"}} className={styles.colorDiv}></div></li>
            <li onClick={(e)=> setcolor(e.target.style.backgroundColor)}><div style={{backgroundColor: "pink"}} className={styles.colorDiv}></div></li>
          </ul>
        </div>
      </div>

      <div>
        <div>
          <canvas ref={canvasRef}
                  style={{border: "1px solid black"}}
                  onMouseDown={evtIniciaDibujo}
                  onMouseMove={evtDibujaCanvas}
                  onMouseUp={evtTerminaDibujo}
                  
                  ></canvas>
        </div>
        <div>
          <button onClick={handleMove}>Obtener palabra</button>
          <div>{word}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
