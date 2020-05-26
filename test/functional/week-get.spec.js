const { test, trait } = use('Test/Suite')('Week Get')
const { testRequireField, testInvalidDate } = require('../helpers')

trait('Test/ApiClient')

const data = {
  firstname: 'Arthur',
  lastname: 'Dufour'
}

// ===============================================================
// == GET /v1/week
// ===============================================================

test('should test that firstname is required', async ({ client }) => {
  await testRequireField('firstname', data, '/v1/week', client)
})

test('should test that lastname is required', async ({ client }) => {
  await testRequireField('lastname', data, '/v1/week', client)
})

test('should return the week\'s courses', async ({ client, assert }) => {
  const response = await client
    .get('/v1/week')
    .send(data)
    .end()

  assert.property(response.body, 'week')
  response.assertStatus(200)
}).timeout(0)

test('should return the week\'s courses from redis (cached)', async ({ client, assert }) => {
  const response = await client
    .get('/v1/week')
    .send(data)
    .end()

  assert.property(response.body, 'week')
  response.assertStatus(200)
}).timeout(50)

// ===============================================================
// == GET /v1/week/:date
// ===============================================================

test('should test that firstname is required', async ({ client }) => {
  await testRequireField('firstname', data, '/v1/week/05-25-2020', client)
})

test('should test that lastname is required', async ({ client }) => {
  await testRequireField('lastname', data, '/v1/week/05-25-2020', client)
})

test('should test that date is invalid', async ({ client }) => {
  await testInvalidDate(data, '/v1/week/invalid-date', client)
})

test('should test that date is invalid', async ({ client }) => {
  await testInvalidDate(data, '/v1/week/13-05-2020', client)
})

test('should return the week\'s courses', async ({ client, assert }) => {
  const response = await client
    .get('/v1/week/04-25-2020')
    .send(data)
    .end()

  assert.property(response.body, 'week')
  response.assertStatus(200)
}).timeout(0)

test('should return the week\'s courses from redis (cached)', async ({ client, assert }) => {
  const response = await client
    .get('/v1/week/04-25-2020')
    .send(data)
    .end()

  assert.property(response.body, 'week')
  response.assertStatus(200)
}).timeout(50)
