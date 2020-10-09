const { test, trait } = use('Test/Suite')('Teams Get')
const { testRequireField } = require('../helpers')

trait('Test/ApiClient')

const data = {
  firstname: 'Arthur',
  lastname: 'Dufour'
}

// ===============================================================
// == GET /v1/teams
// ===============================================================

test('should test that firstname is required', async ({ client }) => {
  await testRequireField('firstname', data, '/v1/teams', client)
})

test('should test that lastname is required', async ({ client }) => {
  await testRequireField('lastname', data, '/v1/teams', client)
})

test('should not throw an error', async ({ client, assert }) => {
  const response = await client
    .get('/v1/teams')
    .send(data)
    .end()

  response.assertStatus(200)
}).timeout(0)
