exports.hasProfessorField = (req, res, next) => {
  const _professor = req.params.professor

  if (!_professor) {
    return res.status(412).json({
      message: 'Missing professor name field'
    })
  }

  return next()
}
