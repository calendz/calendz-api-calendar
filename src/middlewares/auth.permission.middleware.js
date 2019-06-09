exports.minimumPermissionLevelRequired = (requiredPermissionLevel) => {
  return (req, res, next) => {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel)
    if (userPermissionLevel && requiredPermissionLevel) {
      return next()
    } else {
      return res.status(403).send()
    }
  }
}
