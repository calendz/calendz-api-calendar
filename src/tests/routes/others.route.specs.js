const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const helper = require('../test.helper')

describe('./routes/others.route', () => {
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

  describe('GET /v1/health-check - api status', () => {
    it('should success (200) : ok', (done) => {
      request(app).get('/v1/health-check')
        .expect(200, done)
    })
  })

  describe('GET /v1/version - api version', () => {
    it('should success (200): version', (done) => {
      request(app).get('/v1/version')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.isDefined(res.body)
          assert.isDefined(res.body.version)
          done()
        })
    })
  })
})
