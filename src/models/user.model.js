const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstname: { type: String, minLength: 3, maxlength: 32, required: true },
  lastname: { type: String, minLength: 3, maxlength: 32, required: true },
  email: { type: String, minLength: 12, maxLength: 64, required: true, unique: true },
  password: { type: String, minLength: 6, maxLength: 64, required: true },
  permissionLevel: { type: String, enum: ['MEMBER', 'ADMIN'], default: 'MEMBER', required: true },
  grade: { type: String, enum: ['B1', 'B2', 'B3', 'I1', 'I2'], required: true },
  city: { type: String, enum: ['Arras', 'Auxerre', 'Bordeaux', 'Brest', 'Grenoble', 'Lille', 'Lyon', 'Montpellier', 'Nantes', 'Paris', 'Dakar'], required: true },
  bts: { type: Boolean, default: false, required: false },
  isActive: { type: Boolean, default: false, required: true }
})

module.exports = mongoose.model('User', userSchema)
