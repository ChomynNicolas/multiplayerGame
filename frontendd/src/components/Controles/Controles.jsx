import React from "react";
import styles from "./Controles.module.css";

const Controles = ({ handleMove, word, Rondas, limpiarElLienzo,roomId }) => {
  return (
    <div className={styles.controlsContainer}>
      <button className={styles.limpiarBtn} onClick={limpiarElLienzo}>Limpiar</button>
      <div className={styles.palabraContainer}>
        <button className={styles.getPalabrabtn} onClick={handleMove}>Obtener palabra</button>
        <div className={styles.palabra}>{word}</div>
      </div>
      <div className={styles.rondas}>Rondas: <span className={styles.span}>{Rondas}</span></div>
      <div className={styles.rondas}>Id de la sala: <span className={styles.span}>{roomId}</span></div>
    </div>
  );
};

export default Controles;
