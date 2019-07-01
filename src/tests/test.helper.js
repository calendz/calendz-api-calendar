const assert = require('chai').assert
const request = require('supertest')
const app = require('../app')

const token = require('../config/tokens').tokens[0]

module.exports = {
  // ===========================================
  // == helper functions
  // ===========================================
  hasBodyMessage (body, message) {
    assert.isString(body.message)
    assert.property(body, 'message')
    assert.propertyVal(body, 'message', message)
  },

  hasBodyErrors (body) {
    assert.property(body, 'errors')
    assert.isArray(body.errors)
  },

  hasBodyErrorsThatContains (body, message) {
    this.hasBodyErrors(body)
    assert.isNotEmpty(body.errors)
    assert.include(body.errors, message)
  },

  defaultSets: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  defaultSetsWithAuth: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-access-token': token
  },

  // ===========================================
  // == whole feature functions
  // ===========================================

  // authentication
  testAuthentication (route) {
    it('should fail (401) : authentication required', (done) => {
      request(app).get(route).set(this.defaultSets).expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Authentication required')
          done()
        })
    })

    it('should fail (400) : invalid token', (done) => {
      request(app).get(route).set(this.defaultSets).expect('Content-Type', /json/)
        .set('x-access-token', 'notAToken')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Invalid token')
          done()
        })
    })
  },

  // firstname & lastname
  testFirstnameAndLastname (route) {
    it('should fail (412) : missing firstname', (done) => {
      request(app).get(route).set(this.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ lastname: 'Dufour' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Missing firstname field')
          done()
        })
    })

    it('should fail (412) : empty firstname', (done) => {
      request(app).get(route).set(this.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: '', lastname: 'Dufour' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Missing firstname field')
          done()
        })
    })

    it('should fail (412) : missing lastname', (done) => {
      request(app).get(route).set(this.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Missing lastname field')
          done()
        })
    })

    it('should fail (412) : empty lastname', (done) => {
      request(app).get(route).set(this.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Missing lastname field')
          done()
        })
    })
  },

  // date
  testDate (route) {
    it('should fail (409) : invalid date format', (done) => {
      request(app).get(route).set(this.defaultSetsWithAuth).expect('Content-Type', /json/)
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err)
          this.hasBodyMessage(res.body, 'Invalid date format')
          done()
        })
    })
  }
}
