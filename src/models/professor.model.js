const mongoose = require('mongoose')
const Schema = mongoose.Schema

const professorSchema = new Schema({
  firstname: { type: String, minlength: 2, maxlength: 32, required: true },
  lastname: { type: String, minlength: 2, maxlength: 32, required: true },
  courses: { type: Array, default: [] }
})

module.exports = mongoose.model('Professor', professorSchema)
