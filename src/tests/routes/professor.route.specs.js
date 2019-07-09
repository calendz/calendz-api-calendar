const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const helper = require('../test.helper')

describe('./routes/professor.route', () => {
  // ==================================================
  // == GET /api/v1/professor
  // ==================================================
  describe('GET /api/v1/professor - get all professors of the current user for the current year', () => {
    // make sure route requires auth
    helper.testAuthentication('/api/v1/professor')

    // make sure route gets user's firstname & lastname
    helper.testFirstnameAndLastname('/api/v1/professor')

    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/professor').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
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
  // == GET /api/v1/professor/:professor
  // ====================================================
  describe('GET /api/v1/professor/:professor - get by name', () => {
    // make sure route requires auth
    helper.testAuthentication('/api/v1/professor/chevalier')

    // make sure route gets user's firstname & lastname
    helper.testFirstnameAndLastname('/api/v1/professor/chevalier')

    it('should success (200) : ok', (done) => {
      request(app).get('/api/v1/professor/chevalier').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'professor')
          assert.isArray(res.body.professor)
          done()
        })
    })
  })
})
