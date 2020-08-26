'use strict'

module.exports = async function testRequireField (field, data, endpoint, client) {
  const response = await client
    .get(endpoint)
    .send(omit(data, field))
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    errors: [{
      source: { pointer: field },
      title: 'required'
    }]
  })
}

function omit (obj, omitKey) {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== omitKey) result[key] = obj[key]
    return result
  }, {})
}
