'use strict'

module.exports = async function invalidDate (data, endpoint, client) {
  const response = await client
    .get(endpoint)
    .send(data)
    .end()

  response.assertStatus(412)
  response.assertJSONSubset({
    errors: [{
      status: 412,
      code: 'E_INVALID_DATE'
    }]
  })
}
