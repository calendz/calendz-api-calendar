const tokens = require('../config/tokens').tokens

exports.validTokenNeeded = (req, res, next) => {
  const token = req.params.token || req.body.token || req.headers['x-access-token'] || req.query.token

  // no token provided
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  // invalid token
  if (!tokens.find(aToken => aToken === token)) {
    return res.status(400).json({ error: 'Invalid token' })
  }

  return next()
}
