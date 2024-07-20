const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/usuarios')
  .then(()=>{
    console.log('base de datos conectada')
  })
  .catch((err)=>{
    console.log(err)
  })
