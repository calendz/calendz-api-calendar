exports.hasProfessorField = (req, res, next) => {
  const _professor = req.query.professor

  if (!_professor) return res.status(412).json({ error: 'Missing professor name field' })

  return next()
}
