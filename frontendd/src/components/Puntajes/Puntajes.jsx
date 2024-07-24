
import { useEffect, useState } from 'react'
import styles from './Puntajes.module.css'




const Puntajes = ({players,socket,setPlayers}) => {

  const [sumUser, setSumUser] = useState("");



  useEffect(() => {
    socket.on('server:generando-puntos',(user)=>{

      setSumUser(user)
    })
  
    
  }, [])

  

  useEffect(() => {
    
    const newPlayer = players.map(player=>{
      if(player.name === sumUser){
        player.points+=10;
      }
      return player
    })
    setSumUser('')
    
  }, [sumUser])
  


  
  




  
  return (
    <div className={styles.usuariosConectados}>
      <div className={styles.titulos}>
        <span className={styles.user}>Usuarios</span>
        <span className={styles.points}>Puntos</span>
      </div>
      <hr />
      <div>
        {
          players.map(player=> (
            <div className={styles.userContainer} key={player.color}>
              <span style={{color: `${player.color}` }  } className={styles.name}>{player.name}</span>
              <span className={styles.puntos}>{player.points}</span>

            </div>
          ))
        }


      </div>



    </div>
  )
}

export default Puntajes