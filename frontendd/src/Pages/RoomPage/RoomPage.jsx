import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./RoomPage.module.css";
import Herramientas from "../../components/Herramientas/Herramienta";
import Colores from "../../components/Colores/Colores";
import Controles from "../../components/Controles/Controles";
import Canvas from "../../components/Canvas/Canvas";
import Modal from "../../components/Modal/Modal";
import Chat from "../../components/Chat/Chat";
import OtroModal from "../../components/OtroModal/OtroModal";
import ModalGanador from "../../components/ModalGanador/ModalGanador";
import { useNavigate, useParams } from "react-router-dom";
import Puntajes from "../../components/Puntajes/Puntajes";
import Avisos from "../../components/Avisos/Avisos";

const socket = io("https://gameserver-p0ye.onrender.com/");

function Room() {
  const [word, setWord] = useState("");
  const [loadingPalabra, setLoadingPalabra] = useState(false);
  const [dibujando, setDibujando] = useState(false);
  const [puntos, setPuntos] = useState([]);
  const [color, setColor] = useState("black");
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [msg, setMsg] = useState("");
  const [mesagges, setMesagges] = useState([]);
  const [userWinner, setUserWinner] = useState("");
  const [winner, setWinner] = useState("");
  const [gameFinish, setGameFinish] = useState(false);
  const [palabraAdiv, setPalabraAdiv] = useState("");
  const [poderDibujar, setPoderDibujar] = useState(false);
  const [Rondas, setRondas] = useState(5);
  const [otroModal, setOtroModal] = useState(false);
  const [palabraModal, setPalabraModal] = useState("");
  const [palabraModalJugador, setPalabraModalJugador] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState(localStorage.getItem("user"));
  const [salaLlena, setSalaLlena] = useState(false);
  const [usuarioColor, setUsuarioColor] = useState("")
  const { roomId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("server:getword", (palabra) => {
      setWord(palabra);
      setPoderDibujar(true);
      setOtroModal(true);
      setPalabraModalJugador(
        "Tienes la palabra, haz tu mejor intento de dibujo"
      );
    });

    socket.on("server:palabrasecreta", (palabra) => {
      setPalabraAdiv(palabra);
      setLoadingPalabra(true);
      setOtroModal(true);
      setPalabraModal(
        "Alguien tiene la palabra, intenta adivinar con el dibujo"
      );
    });

    socket.emit("join-room", { roomId, playerName });

    socket.on("player-joined", (players) => {
      
      setPlayers(players);
    });

    socket.on("room-full", () => {
      setSalaLlena(true);
    });


    socket.on('setColor',(color)=>{
      
      setUsuarioColor(color);
    })

    return () => {
      socket.off("server:getword");
      socket.off("server:palabrasecreta");
      socket.off("player-joined");
      socket.off("room-full");
      socket.off('setcolor')
    };
  }, [roomId, playerName]);

  

  const handleSelectColor = (e) => {
    if (!poderDibujar) {
      return;
    }
    const selectedColor = e.target.style.backgroundColor;
    setColor(selectedColor);
    socket.emit("client:color", selectedColor);
  };

  const handleMove = () => {
    if (!loadingPalabra && Rondas > 0) {
      socket.emit("client:getword");
      socket.emit("client:limpiar");
    }
  };

  const limpiarElLienzo = () => {
    if (!poderDibujar) {
      return;
    }
    socket.emit("client:limpiar");
  };

  const handleSelectOptions = (options) => {
    if (!poderDibujar) {
      return;
    }
    socket.emit("client:options", options);
  };

  if (salaLlena) {
    return <div className={styles.salallenaContainer}>
      <p className={styles.salallenaParrafo}>La sala esta llena</p>
      <button onClick={()=> navigate('/')} className={styles.salallenabtn}>Volver al inicio</button>
    </div>;
  }

  if ((gameFinish)&&(!loadingPalabra && Rondas > 0)) {
    setTimeout(() => {
      socket.emit("client:getword");
    }, 2000);
    socket.emit("client:limpiar");
  }

  return (
    <div className={styles.container}>
      <div className={styles.elementsContainer}>
        <Herramientas handleSelectOptions={handleSelectOptions} />
        <Colores handleSelectColor={handleSelectColor} />
        <Controles
          handleMove={handleMove}
          word={word}
          Rondas={Rondas}
          limpiarElLienzo={limpiarElLienzo}
          roomId={roomId}
        />
      </div>
      <div className={styles.canvaAndButtonContainer}>

        <Puntajes players={players}/>
        <Canvas
          dibujando={dibujando}
          setDibujando={setDibujando}
          puntos={puntos}
          setPuntos={setPuntos}
          socket={socket}
          loadingPalabra={loadingPalabra}
          Rondas={Rondas}
          poderDibujar={poderDibujar}
        />
        <Avisos winner={winner} userWinner={userWinner}  />
      </div>
      {Rondas < 1 ? <Modal /> : ""}
      {!otroModal ? (
        ""
      ) : (
        <OtroModal
          palabraModal={palabraModal}
          setOtroModal={setOtroModal}
          palabraModalJugador={palabraModalJugador}
          setPalabraModal={setPalabraModal}
          setPalabraModalJugador={setPalabraModalJugador}
        />
      )}
    
      <Chat
        user={user}
        setUser={setUser}
        msg={msg}
        setMsg={setMsg}
        mesagges={mesagges}
        setMesagges={setMesagges}
        socket={socket}
        palabraAdiv={palabraAdiv}
        setWinner={setWinner}
        setUserWinner={setUserWinner}
        setGameFinish={setGameFinish}
        gameFinish={gameFinish}
        winner={winner}
        userWinner={userWinner}
        setLoadingPalabra={setLoadingPalabra}
        setWord={setWord}
        setRondas={setRondas}
        usuarioColor={usuarioColor}
      />
    </div>
  );
}

export default Room;
