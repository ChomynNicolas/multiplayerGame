import React from "react";
import styles from "./Controles.module.css";

const Controles = ({ handleMove, word, Rondas, limpiarElLienzo }) => {
  return (
    <div className={styles.controlsContainer}>
      <button onClick={handleMove}>Obtener palabra</button>
      <div>{word}</div>
      <button onClick={limpiarElLienzo}>Limpiar</button>
      <div>Rondas: {Rondas}</div>
    </div>
  );
};

export default Controles;
