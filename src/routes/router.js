const express = require('express')
const dayRoutes = require('../routes/day.route')
const weekRoutes = require('../routes/week.route.js')
const version = require('../../package.json').version

const router = express.Router()

// Route permettant de voir si l'API est up ou non
router.get('/health-check', (req, res) => { res.send('OK') })
// Route utilisée pour récupérer la version de l'api
router.get('/version', (req, res) => { res.json({ version }) })

router.use('/day', dayRoutes)
router.use('/week', weekRoutes)

module.exports = router
