exports.minimumPermissionLevelRequired = (requiredPermissionLevel) => {
  return (req, res, next) => {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel, 10)
    if (userPermissionLevel && requiredPermissionLevel) {
      return next()
    } else {
      return res.status(403).send()
    }
  }
}
