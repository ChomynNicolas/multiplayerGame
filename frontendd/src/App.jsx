import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styles from "./App.module.css";
import lapiz from "./assets/lapiz.png";
import marcador from "./assets/marcador.png";
import borrador from "./assets/borrador.png";

const socket = io("http://localhost:4000");

function App() {
  const [word, setWord] = useState([]);
  const [dibujando, setDibujando] = useState(false);
  const [puntos, setPuntos] = useState([]);
  const [color, setColor] = useState("black");
  const [user, setUser] = useState("anonimo")
  const [msg, setMsg] = useState("")
  const [mesagges, setMesagges] = useState([])
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
    socket.on("server:getword", (data) => {
      const random = Math.floor(Math.random() * data.length);
      const wordFilter = data.filter((data, ind) => ind === random);
      setWord(wordFilter);
    });

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
      const context = contextRef;
      context.current.strokeStyle = color;
      
    });

    socket.on('server:option',(data)=>{
      const context = contextRef;
      context.current.lineWidth = data.height;
      if(data.color){
        context.current.strokeStyle = data.color;
      }
    })

    socket.on("server:limpiar", () => {
      const canvas = canvasRef.current;
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on('server:sendMsg', ({user,msg}) => {
      setMesagges((prevMensajes) => [...prevMensajes, { user, msg }]);
    });

    return () => {
      socket.off("server:getword");
      socket.off("server:dibujando");
      socket.off("server:color");
      socket.off("server:option");
      socket.off("server:limpiar");
      socket.off("server:sendMsg");
    };
  }, []);

  const handleSelectColor = (e) => {
    const selectedColor = e.target.style.backgroundColor;
    setColor(selectedColor);
    socket.emit("client:color", selectedColor);
  };

  const handleMove = () => {
    socket.emit("client:getword");
  };

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
    setDibujando(true);
    const offsetX = evt.clientX - canvasRef.current.offsetLeft;
    const offsetY = evt.clientY - canvasRef.current.offsetTop;
    setPuntos([{ x: offsetX, y: offsetY }]);
  };

  const evtTerminaDibujo = () => {
    setDibujando(false);
    setPuntos([]);
  };

  

  const limpiarElLienzo = () => {
    socket.emit("client:limpiar");
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  

  const handleSelectOptions = (options) => {
    socket.emit("client:options", options);
  };


  const handleEnviarMensaje = () =>{
    if(msg.length>0){
      socket.emit('client:sendMsg',({msg,user}));

    }
  }

  



  console.log(mesagges)


  return (
    <div>
      <div className={styles.elementsContainer}>
        <div className={styles.herramientContainer}>
          <img
            src={lapiz}
            alt="Lapiz"
            className={styles.imgHerramienta}
            onClick={() => handleSelectOptions("lapiz")}
          />
          <img
            src={marcador}
            alt="marcador"
            className={styles.imgHerramienta}
            onClick={() => handleSelectOptions("marcador")}
          />
          <img
            src={borrador}
            alt="borrador"
            onClick={() => handleSelectOptions("borrador")}
            className={styles.imgHerramienta}
            
          />
        </div>
        <div>
          <ul className={styles.colorContainer}>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "black" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "red" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "blue" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "green" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "yellow" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "cyan" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "brown" }}
                className={styles.colorDiv}
              ></div>
            </li>
            <li onClick={handleSelectColor}>
              <div
                style={{ backgroundColor: "pink" }}
                className={styles.colorDiv}
              ></div>
            </li>
          </ul>
        </div>
        <div>
          <button onClick={limpiarElLienzo}>Limpiar</button>
        </div>
      </div>

      <div className={styles.canvaAndButtonContainer}>
        <div className={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            style={{ border: "1px solid black" }}
            onMouseDown={evtIniciaDibujo}
            onMouseMove={evtDibujaCanvas}
            onMouseUp={evtTerminaDibujo}
            className={styles.canvaStyle}
          ></canvas>
        </div>
        <div className={styles.buttonContainer}>
          <div >
            <button onClick={handleMove}>Obtener palabra</button>
            <div>{word}</div>
          </div>
          
        </div>

      </div>

      <div className={styles.chatContainer}>
          <div className={styles.chatBox}>
            {
              mesagges.map((msg)=>{
                return (
                  <div className={styles.textBox}>
                    <label>{msg.user}: </label>
                    <div className={styles.msgContainer}>
                      <p className={styles.msgText}>{msg.msg}</p>

                    </div>

                  </div>
                );
              })
            }

          </div>
          
            
          
          <div className={styles.sendContainer}>
            <input onChange={(e)=> setUser(e.target.value)} type="text" placeholder="ingresar nombre del usuario" className={styles.userName} />
            <input onChange={(e)=> setMsg(e.target.value)}  type="text" className={styles.inputStyle}/>
            <button onClick={handleEnviarMensaje} className={styles.button}>Enviar</button>
          </div>

      </div>






    </div>
  );
}

export default App;
