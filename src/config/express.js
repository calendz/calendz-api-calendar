const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('../routes/router')
const config = require('./config')
const logger = require('./winston')

const app = express()

// ============================================
// == misc configuration
// ============================================

// logging method
if (config.node_env === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('common'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

// ============================================
// == app security
// ============================================

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS (Cross Origin Resource Sharing)
app.use(cors())

// ============================================
// == configure router & error handler
// ============================================

// API router
app.use('/api/v1/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not Found'
  })
  next()
})

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  logger.error('Uncaught exception', err)
  err.status = 400
  res.status(err.status || 500).json({ error: 'Internal server error' })
  next(err)
})

module.exports = app
