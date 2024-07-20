const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: false,
    unique: true,
    trim: true
}
},{
  timestamps:true
})


const User = mongoose.model('User', userSchema)

module.exports = User;