import React, { useRef, useEffect } from "react";
import styles from "./Chat.module.css";

const Chat = ({ user, setUser, msg, setMsg, mesagges, setMesagges, socket, palabraAdiv, setWinner, setUserWinner, setGameFinish, gameFinish, winner, userWinner,setLoadingPalabra,setWord,setRondas }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('server:sendMsg', ({ user, msg, palabraAdiv }) => {
      setMesagges((prevMensajes) => [...prevMensajes, { user, msg }]);
      if (msg.includes(palabraAdiv)) {
        setWinner(msg);
        setUserWinner(user);
        setGameFinish(true);
        setLoadingPalabra(false)
        setWord("")
        setRondas((prevRondas) =>{
          const updatedRounds = prevRondas-=1;
          return updatedRounds;
        });
      }
      
    });

    return () => {
      socket.off('server:sendMsg');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesagges]);

  const handleEnviarMensaje = () => {
    if (msg.length > 0) {
      socket.emit('client:sendMsg', ({ msg, user, palabraAdiv }));
    }
  }

  

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {mesagges.map((msg, ind) => (
          <div className={styles.textBox} key={ind}>
            <label className={styles.userStyle}>{msg.user}: </label>
            <div className={styles.msgContainer}>
              <p className={styles.msgText}>{msg.msg}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.sendContainer}>
        <input
          onChange={(e) => setUser(e.target.value)}
          type="text"
          placeholder="Ingresar nombre del usuario"
          className={styles.userName}
        />
        <input
          onChange={(e) => setMsg(e.target.value)}
          type="text"
          className={styles.inputStyle}
        />
        <button onClick={handleEnviarMensaje} className={styles.button}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
