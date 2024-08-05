import React, { useRef, useEffect, useState } from "react";
import styles from "./Chat.module.css";

const Chat = ({
  user,
  setUser,
  msg,
  setMsg,
  mesagges,
  setMesagges,
  socket,
  palabraAdiv,
  setWinner,
  setUserWinner,
  setGameFinish,
  gameFinish,
  winner,
  userWinner,
  loadingPalabra,
  setLoadingPalabra,
  setWord,
  setRondas,
  usuarioColor,
  setPalabraAdiv,
  players
}) => {
  const [puntos, setPuntos] = useState(5)
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("server:sendMsg", ({ user, msg, palabraAdiv, usuarioColor2, players }) => {
      setMesagges((prevMensajes) => [
        ...prevMensajes,
        { user, msg, usuarioColor2 },
      ]);

      if (!palabraAdiv) {
        return;
      }
      const palabraRegex = new RegExp(`\\b${palabraAdiv}\\b`, "i");
      if (palabraRegex.test(msg) && !gameFinish) {
        setWinner(msg);
        setUserWinner(user);
        setGameFinish(true);
        setLoadingPalabra(false);
        setPalabraAdiv("");
        setWord("");
        setRondas((prevRondas) => prevRondas - 1);

        socket.emit("client:generando-puntos", {user, puntos,players});
      }
    });

    return () => {
      socket.off("server:sendMsg");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesagges]);

  const handleEnviarMensaje = () => {
    if (msg.length > 0) {
      setMsg("");

      socket.emit("client:sendMsg", { msg, user, palabraAdiv, usuarioColor, players });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEnviarMensaje();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {mesagges.map((msg, ind) => (
          <div
            className={`${styles.textBox} ${
              msg.user === user ? styles.clientMsg : ""
            }`}
            key={ind}
          >
            <label
              style={{ color: `${msg.usuarioColor2}` }}
              className={styles.userStyle}
            >
              {msg.user}:{" "}
            </label>
            <div className={styles.msgContainer}>
              <p className={styles.msgText}>{msg.msg}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.sendContainer}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          type="text"
          className={styles.inputStyle}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleEnviarMensaje} className={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
