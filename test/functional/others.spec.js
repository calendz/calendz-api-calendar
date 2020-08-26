'use strict'

const { test, trait } = use('Test/Suite')('Others')

trait('Test/ApiClient')

test('should return API version and uptime', async ({ client, assert }) => {
  const response = await client
    .get('/')
    .end()

  response.assertStatus(200)
  assert.isDefined(response.body.version)
  assert.isDefined(response.body.uptime)
})
