import React from 'react'
import './modal.css'

const Modal = () => {
  const handleReload = () => {
    window.location.reload();
  }

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-content">
          <p className="card-heading">¿Quieres volver a jugar?</p>
        </div>
        <div className="card-button-wrapper">
          <button className="card-button primary" onClick={handleReload}>Aceptar</button>
        </div>
      </div>
    </div>
  )
}

export default Modal