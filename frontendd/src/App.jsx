import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styles from './App.module.css'
const socket = io("http://localhost:4000");
import lapiz from './assets/lapiz.png'
import marcador from './assets/marcador.png'
import borrador from './assets/borrador.png'

function App() {
  const [word, setword] = useState([]);
  
  const [dibujando, setDibujando] = useState(false)
  const [puntos, setPuntos] = useState([])
  const [color, setcolor] = useState("black")
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width =  window.innerWidth *0.5 ;
    canvas.height = window.innerHeight *0.5;
    
    const context = canvas.getContext("2d");
    
    context.lineCap = "round"
    context.strokeStyle = color
    context.lineWidth = 5
    contextRef.current = context

    
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

  const handleSelectColor = (e) =>{
    contextRef.current.strokeStyle = e.target.style.backgroundColor
  }





  const handleMove = () => {
    socket.emit("client:getword");
  };
  
  const evtDibujaCanvas = (evt) =>{

    if(!dibujando) return
    const offsetX = evt.clientX - 480;
    const offsetY = evt.clientY - 67;
    contextRef.current.lineTo(offsetX,offsetY);
    contextRef.current.stroke();
    
    setPuntos([...puntos,{x: offsetX, y: offsetY}])
    



  }

  const evtIniciaDibujo = (evt)=>{
    const offsetX = evt.clientX - 480;
    const offsetY = evt.clientY - 67;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX,offsetY);
    setDibujando(true)
  }

  const evtTerminaDibujo = () =>{
    contextRef.current.closePath();
    setDibujando(false)
    console.log(puntos)
    if(contextRef.current.lineWidth===50){
      contextRef.current.lineWidth = 5
    }
  }
  
  const handleBorrador = ()=>{
    contextRef.current.lineWidth = 50
    contextRef.current.strokeStyle = "white"
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
            <li onClick={handleSelectColor}><div style={{backgroundColor: "black"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "red"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "blue"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "green"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "yellow"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "cyan"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "brown"}} className={styles.colorDiv}></div></li>
            <li onClick={handleSelectColor}><div style={{backgroundColor: "pink"}} className={styles.colorDiv}></div></li>
          </ul>
        </div>
      </div>

      <div>
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef}
                  style={{border: "1px solid black"}}
                  onMouseDown={evtIniciaDibujo}
                  onMouseMove={evtDibujaCanvas}
                  onMouseUp={evtTerminaDibujo}
                  className={styles.canvaStyle}
                  
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
