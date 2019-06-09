
exports.hasFirstnameAndLastname = (req, res, next) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname

  if (!_firstname || !_lastname) {
    return res.status(412).json({ error: 'Missing firstname and/or lastname fields' })
  }

  return next()
}
