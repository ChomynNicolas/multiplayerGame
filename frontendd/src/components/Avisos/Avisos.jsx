import { useEffect, useRef, useState } from 'react'
import styles from './Avisos.module.css'

const Avisos = ({winner,userWinner}) => {

  const [mensajes, setMensajes] = useState([])
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if(winner.length>0){

      setMensajes(prevMensajes =>[...mensajes,{winner,userWinner}])
    }
    
    
    
  }, [winner])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);
  


  

  console.log(mensajes)

  return (
    <div className={styles.usuariosConectados}>

      <div className={styles.msgContainer}>
        {
          mensajes.map((msg)=> (
            <div className={styles.msg}>
              <h3 className={styles.ganador}> Ganador: <span className={styles.usuarioTexto}>{msg.userWinner}</span></h3>
              <p className={styles.texto}>{msg.winner}</p>

            </div>
          ))
        }
        <div ref={messagesEndRef} />
      </div>
      

    </div>
  )
}

export default Avisos