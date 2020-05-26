const { test, trait } = use('Test/Suite')('Day Get')
const { testRequireField, testInvalidDate } = require('../helpers')

trait('Test/ApiClient')

const data = {
  firstname: 'Arthur',
  lastname: 'Dufour'
}

// ===============================================================
// == GET /v1/day
// ===============================================================

test('should test that firstname is required', async ({ client }) => {
  await testRequireField('firstname', data, '/v1/day', client)
})

test('should test that lastname is required', async ({ client }) => {
  await testRequireField('lastname', data, '/v1/day', client)
})

test('should return the day\'s courses', async ({ client, assert }) => {
  const response = await client
    .get('/v1/day')
    .send(data)
    .end()

  assert.property(response.body, 'courses')
  response.assertStatus(200)
}).timeout(0)

test('should return the day\'s courses from redis (cached)', async ({ client, assert }) => {
  const response = await client
    .get('/v1/day')
    .send(data)
    .end()

  assert.property(response.body, 'courses')
  response.assertStatus(200)
}).timeout(50)

// ===============================================================
// == GET /v1/day/:date
// ===============================================================

test('should test that firstname is required', async ({ client }) => {
  await testRequireField('firstname', data, '/v1/day/05-25-2020', client)
})

test('should test that lastname is required', async ({ client }) => {
  await testRequireField('lastname', data, '/v1/day/05-25-2020', client)
})

test('should test that date is invalid', async ({ client }) => {
  await testInvalidDate(data, '/v1/day/invalid-date', client)
})

test('should test that date is invalid', async ({ client }) => {
  await testInvalidDate(data, '/v1/day/13-05-2020', client)
})

test('should return the day\'s courses', async ({ client, assert }) => {
  const response = await client
    .get('/v1/day/05-25-2020')
    .send(data)
    .end()

  assert.property(response.body, 'courses')
  response.assertStatus(200)
}).timeout(0)

test('should return the day\'s courses from redis (cached)', async ({ client, assert }) => {
  const response = await client
    .get('/v1/day/05-25-2020')
    .send(data)
    .end()

  assert.property(response.body, 'courses')
  response.assertStatus(200)
}).timeout(50)
