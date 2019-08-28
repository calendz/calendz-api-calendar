const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const helper = require('../test.helper')

describe('./routes/day.route', () => {
  // ==================================================
  // == GET /api/v1/day
  // ==================================================
  describe('GET /api/v1/day - get current day', () => {
    // make sure route requires auth
    helper.testAuthentication('/api/v1/day')

    // make sure route gets user's firstname & lastname
    helper.testFirstnameAndLastname('/api/v1/day')

    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/day').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'courses')
          assert.isArray(res.body.courses)
          done()
        })
    })
  })

  // ====================================================
  // == GET /api/v1/day/:date
  // ====================================================
  describe('GET /api/v1/day/:date - get by date', () => {
    // make sure route requires auth
    helper.testAuthentication('/api/v1/day/06-06-19')

    // make sure route gets user's firstname & lastname
    helper.testFirstnameAndLastname('/api/v1/day/06-06-19')

    // make sure date is valid
    helper.testDate('/api/v1/day/aze')

    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/day/06-06-19').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'courses')
          assert.isArray(res.body.courses)
          done()
        })
    })
  })
})
