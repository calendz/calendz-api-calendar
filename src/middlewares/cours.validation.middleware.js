exports.hasCoursField = (req, res, next) => {
  const _cours = req.params.cours

  if (!_cours) return res.status(412).json({ error: 'Missing cours name field' })

  return next()
}
