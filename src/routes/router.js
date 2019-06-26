const express = require('express')
const dayRoutes = require('../routes/day.route')
const weekRoutes = require('../routes/week.route.js')
const professorRoutes = require('../routes/professor.route.js')

const router = express.Router()

// Route permettant de voir si l'API est up ou non
router.get('/health-check', (req, res) => { res.send('OK') })

router.use('/day', dayRoutes)
router.use('/week', weekRoutes)
router.use('/professor', professorRoutes)

module.exports = router
