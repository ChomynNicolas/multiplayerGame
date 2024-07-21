import React from 'react'
import './ModalGanador.css'




const ModalGanador = ({palabraAdiv,userWinner,setGameFinish}) => {
  
  const handleClose = () => {
    setGameFinish(false)
    
  }


  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-content">
          <p className="card-heading">Palabra adivinada por: {userWinner}
          </p>
          <p className="card-heading">La palabra era: {palabraAdiv}
          </p>
        </div>
        <div className="card-button-wrapper">
          <button className="card-button primary" onClick={handleClose}>Aceptar</button>
        </div>
      </div>
    </div>
  )
}

export default ModalGanador