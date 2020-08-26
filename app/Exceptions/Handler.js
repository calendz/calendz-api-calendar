'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   * (used here to override some default errors)
   */
  async handle (error, { response }) {
    /* istanbul ignore if */
    if (error.code === 'E_MISSING_DATABASE_ROW') {
      return response.status(404).send({
        errors: [{
          status: 404,
          code: 'E_MODEL_NOT_FOUND',
          detail: 'The requested model cannot be found'
        }]
      })
    }

    return super.handle(...arguments)
  }
}

module.exports = ExceptionHandler
