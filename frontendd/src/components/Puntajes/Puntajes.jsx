
import styles from './Puntajes.module.css'



const Puntajes = ({players}) => {

  console.log(players)
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
            <div className={styles.userContainer}>
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