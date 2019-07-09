const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const helper = require('../test.helper')

describe('./routes/cours.route', () => {
  // ==================================================
  // == GET /api/v1/cours
  // ==================================================
  describe('GET /api/v1/cours - get all courses of the current user for the current year', () => {
    // make sure route requires auth
    helper.testAuthentication('/api/v1/cours')

    // make sure route gets user's firstname & lastname
    helper.testFirstnameAndLastname('/api/v1/cours')

    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/cours').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.isArray(res.body)
          assert.isNotEmpty(res.body)
          done()
        })
    })
  })

  // ====================================================
  // == GET /api/v1/cours/:cours
  // ====================================================
  describe('GET /api/v1/cours/:cours - get by name', () => {
    // make sure route requires auth
    helper.testAuthentication('/api/v1/cours/droit')

    // make sure route gets user's firstname & lastname
    helper.testFirstnameAndLastname('/api/v1/cours/droit')

    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/cours/droit').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'cours')
          assert.isArray(res.body.cours)
          done()
        })
    })
  })
})
