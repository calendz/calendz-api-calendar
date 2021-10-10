'use strict'

const Redis = use('Redis')
const DateUtils = use('DateUtils')

class Cache {
  /**
   * Retrieve week from cache
   */
  async getWeek (firstname, lastname, date) {
    const translatedDate = DateUtils.getWeekNumber(date)
    const result = await Redis.hget(`u:${firstname}.${lastname}`, [`y:${translatedDate.year}|w:${translatedDate.number}`])
    return JSON.parse(result)
  }

  /**
   * Set week in cache, and make it auto-expire
   */
  async setWeek (firstname, lastname, date, data) {
    const translatedDate = DateUtils.getWeekNumber(date)
    const expireIn = DateUtils.computeExpireFriday()
    await Redis.hmset(
      `u:${firstname}.${lastname}`, `y:${translatedDate.year}|w:${translatedDate.number}`,
      JSON.stringify({ ...data, weekNumber: translatedDate.number })
    )
    await Redis.expire(`u:${firstname}.${lastname}`, expireIn)
  }

  /*
  |--------------------------------------------------------------------------
  | Background actualization
  |--------------------------------------------------------------------------
  */

  /**
   * Indicate that requested date has already been scrapped today
   */
  async setIsDailyScrapped (firstname, lastname, date) {
    const translatedDate = DateUtils.getWeekNumber(date)
    const expireIn = DateUtils.computeExpireMidnight()
    await Redis.hmset(`u:${firstname}.${lastname}|daily`, `y:${translatedDate.year}|w:${translatedDate.number}`, 'true')
    await Redis.expire(`u:${firstname}.${lastname}|daily`, expireIn)
  }

  /**
   * Check if date has already been scrapped today
   */
  async getIsDailyScrapped (firstname, lastname, date) {
    const translatedDate = DateUtils.getWeekNumber(date)
    const result = await Redis.hget(`u:${firstname}.${lastname}|daily`, [`y:${translatedDate.year}|w:${translatedDate.number}`])
    return result || false
  }
}

module.exports = Cache
