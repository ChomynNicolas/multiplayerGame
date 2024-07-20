import React from "react";
import lapiz from "../../assets/lapiz.png";
import marcador from "../../assets/marcador.png";
import borrador from "../../assets/borrador.png";
import styles from "./Herramienta.module.css";

const Herramientas = ({ handleSelectOptions }) => {
  return (
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
  );
};

export default Herramientas;
