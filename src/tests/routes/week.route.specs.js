const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const token = require('../../config/tokens')[0]

describe('./routes/week.route', () => {
  // =========================
  // == /api/v1/week
  // =========================
  describe('/api/v1/week - get current week', () => {
    //  authentication
    it('should return 401 : authentication required', (done) => {
      request(app)
        .get('/api/v1/week')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error', 'Authentication required')
          done()
        })
    })

    it('should return 400 : invalid token', (done) => {
      request(app)
        .get('/api/v1/week')
        .set('x-access-token', 'notAToken')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error', 'Invalid token')
          done()
        })
    })

    // missing informations
    it('should return 412 : missing firstname and lastname', (done) => {
      request(app)
        .get('/api/v1/week')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          done()
        })
    })

    it('should return 412 : missing firstname', (done) => {
      request(app)
        .get('/api/v1/week')
        .query({ lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing firstname field')
          done()
        })
    })

    it('should return 412 : empty firstname', (done) => {
      request(app)
        .get('/api/v1/week')
        .query({ firstname: '', lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing firstname field')
          done()
        })
    })

    it('should return 412 : missing lastname', (done) => {
      request(app)
        .get('/api/v1/week')
        .query({ firstname: 'Arthur' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing lastname field')
          done()
        })
    })

    it('should return 412 : empty lastname', (done) => {
      request(app)
        .get('/api/v1/week')
        .query({ firstname: 'Arthur', lastname: '' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing lastname field')
          done()
        })
    })

    // valid query
    it('should return 200 : ok', (done) => {
      request(app)
        .get('/api/v1/week')
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'week')
          done()
        })
    })
  })

  // =========================
  // == /api/v1/week/:date
  // =========================
  describe('/api/v1/week/:date - get by date', () => {
    //  authentication
    it('should return 401 : authentication required', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error', 'Authentication required')
          done()
        })
    })

    it('should return 400 : invalid token', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .set('x-access-token', 'notAToken')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error', 'Invalid token')
          done()
        })
    })

    // missing informations
    it('should return 412 : missing firstname and lastname', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          done()
        })
    })

    it('should return 412 : missing firstname', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .query({ lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing firstname field')
          done()
        })
    })

    it('should return 412 : empty firstname', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .query({ firstname: '', lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing firstname field')
          done()
        })
    })

    it('should return 412 : missing lastname', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .query({ firstname: 'Arthur' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing lastname field')
          done()
        })
    })

    it('should return 412 : empty lastname', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .query({ firstname: 'Arthur', lastname: '' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Missing lastname field')
          done()
        })
    })

    it('should return 409 : invalid date format', (done) => {
      request(app)
        .get('/api/v1/week/aze')
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'error')
          assert.propertyVal(res.body, 'error', 'Invalid date format')
          done()
        })
    })

    // valid query
    it('should return 200 : ok', (done) => {
      request(app)
        .get('/api/v1/week/06-06-19')
        .query({ firstname: 'Arthur', lastname: 'Dufour' })
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'week')
          done()
        })
    })
  })
})
