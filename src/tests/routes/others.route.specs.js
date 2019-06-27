// const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')

describe('./routes/others.route', () => {
  describe('api status', () => {
    it('should return 200 : ok', (done) => {
      request(app)
        .get('/api/v1/health-check')
        .expect(200, done)
    })
  })

  describe('404 errors', () => {
    it('should return 404 : route not found', (done) => {
      request(app)
        .get('/a/route/that/doesnt/exist')
        .expect(404, done)
    })
  })
})
