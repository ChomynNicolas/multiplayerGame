import React from "react";
import styles from "./Colores.module.css";

const Colores = ({ handleSelectColor }) => {
  const colors = ["black", "red", "blue", "green", "yellow", "cyan", "brown", "pink"];
  return (
    <ul className={styles.colorContainer}>
      {colors.map((color) => (
        <li key={color} onClick={handleSelectColor}>
          <div
            style={{ backgroundColor: color }}
            className={styles.colorDiv}
          ></div>
        </li>
      ))}
    </ul>
  );
};

export default Colores;
