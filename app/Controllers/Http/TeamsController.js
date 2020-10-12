'use strict'

const Scrapper = use('Scrapper')
const ScrappingException = use('App/Exceptions/ScrappingException')

class TeamsController {
  /**
   * Get Microsoft Teams current links
   */
  async get ({ request }) {
    const { firstname, lastname } = request.only(['firstname', 'lastname'])

    const result = await Scrapper.fetchTeamsLinks(firstname, lastname)
      .catch(() => { /* istanbul ignore next */ throw new ScrappingException() })

    return result
  }
}

module.exports = TeamsController
