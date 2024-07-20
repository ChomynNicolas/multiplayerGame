import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./App.module.css";
import Herramientas from "./components/Herramientas/Herramienta";
import Colores from "./components/Colores/Colores";
import Controles from "./components/Controles/Controles";
import Canvas from "./components/Canvas/Canvas";
import Modal from "./components/Modal/Modal";
import Chat from "./components/Chat/Chat";
import OtroModal from "./components/OtroModal/OtroModal";
import ModalGanador from "./components/ModalGanador/ModalGanador";

const socket = io("http://localhost:4000");

function App() {
  const [word, setWord] = useState("");
  const [loadingPalabra, setLoadingPalabra] = useState(false);
  const [dibujando, setDibujando] = useState(false);
  const [puntos, setPuntos] = useState([]);
  const [color, setColor] = useState("black");
  const [user, setUser] = useState("anonimo");
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

    return () => {
      socket.off("server:getword");
      socket.off("server:palabrasecreta");
    };
  }, [socket]);

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
        />
      </div>
      <div className={styles.canvaAndButtonContainer}>
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

      {!gameFinish?"":<ModalGanador palabraAdiv={palabraAdiv} userWinner={userWinner} setGameFinish={setGameFinish}/>
      }
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
      />
    </div>
  );
}

export default App;
