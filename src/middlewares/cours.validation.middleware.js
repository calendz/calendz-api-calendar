exports.hasCoursField = (req, res, next) => {
  const _cours = req.params.cours

  if (!_cours) {
    return res.status(412).json({
      message: 'Missing cours name field'
    })
  }

  return next()
}
