const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
  subject: { type: String, required: true },
  grade: { type: String, enum: ['B1 G1', 'B1 G2', 'B2 G1', 'B2 G2', 'B3 G1', 'B3 G2', 'B3 G3', 'I4 G1', 'I4 G2', 'I5 G1', 'I5 G2'], required: true },
  bts: { type: Boolean, default: false },
  professor: { type: Schema.Types.ObjectId, ref: 'Professor', required: true },
  courses: [
    {
      date: { type: String, required: true },
      weekday: { type: String, enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'], required: true },
      start: { type: String, required: true },
      end: { type: String, required: true }
    }
  ]
})

module.exports = mongoose.model('Course', courseSchema)
