import React from "react";
import "./otroModal.css";

const OtroModal = ({
  palabraModal,
  setOtroModal,
  palabraModalJugador,
  setPalabraModal,
  setPalabraModalJugador,
}) => {
  const handleOtroModal = () => {
    setOtroModal(false);
    setPalabraModal("");
    setPalabraModalJugador("");
  };

  setTimeout(()=>{
    setOtroModal(false)

  },2000)

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-content">
          <p className="card-heading">{palabraModalJugador || palabraModal}</p>
        </div>
        <div className="card-button-wrapper">
          <button className="card-button primary" onClick={handleOtroModal}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtroModal;
