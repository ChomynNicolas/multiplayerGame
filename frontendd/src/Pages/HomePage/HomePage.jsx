import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [roomId, setRoomId] = useState("");
  const [user, setuser] = useState("")
  const [error, setError] = useState(false)
  const navigate = useNavigate();

  const createRoom = async () => {
    if(user.length>1){
      const response = await axios.post("https://gameserver-p0ye.onrender.com/create-room", {
        maxPlayers,
      });
      navigate(`/room/${response.data.roomId}`);
      localStorage.setItem("user",user)

    }
    else {
      setError(true)
    }
  };

  const joinRoom = () => {
    if(user.length>1){
      navigate(`/room/${roomId}`);
      localStorage.setItem("user",user)
    }else {
      setError(true)
    }
  };

  const guardarNombre = (e)=>{
    setuser(e.target.value)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create or Join a Room</h1>
      <div>
        <label className={styles.label} >Nombre: </label>
        <input onBlur={(e)=>guardarNombre(e)} className={styles.Input} type="text" placeholder="Ingresar nombre"/>
        {!error?"": <div className={styles.error}>El nombre es requerido</div>}
      </div>
      <div className={styles.createContainer}>
        <div>
          <label className={styles.label}>Numero de jugadores: </label>
        </div>
        <div className={styles.btnContainer}>
          <input
            className={styles.Input}
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
          <button onClick={createRoom} className={styles.button}>
            Crear
          </button>
        </div>
      </div>
      <div className={styles.joinContainer}>
        <div>
          <label className={styles.label}>Codigo de la sala: </label>
        </div>
        <div className={styles.btnContainer}>
          <input
            className={styles.Input}
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom} className={styles.button}>
            Unirse
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
