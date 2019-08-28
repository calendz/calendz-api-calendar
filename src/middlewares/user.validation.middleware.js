
exports.hasFirstnameAndLastname = (req, res, next) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname

  if (!_firstname) {
    return res.status(412).json({
      message: 'Missing firstname field'
    })
  }

  if (!_lastname) {
    return res.status(412).json({
      message: 'Missing lastname field'
    })
  }

  return next()
}
