// const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const helper = require('../test.helper')

describe('./routes/others.route', () => {
  describe('GET /api/v1/health-check - api status', () => {
    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/health-check')
        .expect(200, done)
    })
  })

  describe('GET /a/route/that/doesnt/exist - 404 not found', () => {
    it('should fail (404) : route not found', (done) => {
      request(app).get('/a/route/that/doesnt/exist')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Route not found')
          done()
        })
    })
  })
})
