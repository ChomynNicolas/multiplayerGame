import { useEffect, useState } from "react";
import styles from "./Puntajes.module.css";

const Puntajes = ({ players, socket, setPlayers }) => {
  const [sumUser, setSumUser] = useState("");
  const [puntos, setpuntos] = useState(null)
  useEffect(() => {
    socket.on("server:generando-puntos", (data) => {
      console.log(data)
      setPlayers(data.players)
    });
  }, []);

  
  return (
    <div className={styles.usuariosConectados}>
      <div className={styles.titulos}>
        <span className={styles.user}>Usuarios</span>
        <span className={styles.points}>Puntos</span>
      </div>
      <hr />
      <div>
        {players.map((player) => (
          <div className={styles.userContainer} key={player.color}>
            <span style={{ color: `${player.color}` }} className={styles.name}>
              {player.name}
            </span>
            <span className={styles.puntos}>{player.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Puntajes;
