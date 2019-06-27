const assert = require('chai').assert

const dateTranslator = require('../../utils/dateTranslator')

describe('./utils/dateTranslator', () => {
  // ==================================
  // == #getMonth
  // ==================================
  describe('#getMonth', () => {
    it('should translate months to numbers', () => {
      assert.strictEqual(dateTranslator.getMonth('jan'), '01')
      assert.strictEqual(dateTranslator.getMonth('feb'), '02')
      assert.strictEqual(dateTranslator.getMonth('mar'), '03')
      assert.strictEqual(dateTranslator.getMonth('apr'), '04')
      assert.strictEqual(dateTranslator.getMonth('may'), '05')
      assert.strictEqual(dateTranslator.getMonth('jun'), '06')
      assert.strictEqual(dateTranslator.getMonth('jul'), '07')
      assert.strictEqual(dateTranslator.getMonth('aug'), '08')
      assert.strictEqual(dateTranslator.getMonth('sep'), '09')
      assert.strictEqual(dateTranslator.getMonth('oct'), '10')
      assert.strictEqual(dateTranslator.getMonth('nov'), '11')
      assert.strictEqual(dateTranslator.getMonth('dec'), '12')
    })

    it('should throw an "Unrecognized month name" Error', () => {
      assert.throws(() => { dateTranslator.getMonth('not a valid month') }, Error, 'Unrecognized month name')
    })
  })

  // ==================================
  // == #getDayFromString
  // ==================================
  describe('#getDayFromString', () => {
    it('should return the day included in the string', () => {
      assert.strictEqual(dateTranslator.getDayFromString('sazeeluNDi aze'), 'lundi')
      assert.strictEqual(dateTranslator.getDayFromString('phazeMardiaaze'), 'mardi')
      assert.strictEqual(dateTranslator.getDayFromString('azemerCREDIaze'), 'mercredi')
      assert.strictEqual(dateTranslator.getDayFromString('aa jeudiazeaze'), 'jeudi')
      assert.strictEqual(dateTranslator.getDayFromString('A jVendREdi az'), 'vendredi')
      assert.strictEqual(dateTranslator.getDayFromString('azeuhyiSAmEDIa'), 'samedi')
      assert.strictEqual(dateTranslator.getDayFromString('azeDimaNche ez'), 'dimanche')
    })

    it('should throw an "Unknown day" Error', () => {
      assert.throws(() => { dateTranslator.getDayFromString('thereAre noDaYInTHiSString') }, Error, 'Unknown day')
    })
  })

  // ==================================
  // == #getDayFromInt
  // ==================================
  describe('#getDayFromInt', () => {
    it('should return isoWeekDay', () => {
      assert.strictEqual(dateTranslator.getDayFromInt(1), 'Lundi')
      assert.strictEqual(dateTranslator.getDayFromInt(2), 'Mardi')
      assert.strictEqual(dateTranslator.getDayFromInt(3), 'Mercredi')
      assert.strictEqual(dateTranslator.getDayFromInt(4), 'Jeudi')
      assert.strictEqual(dateTranslator.getDayFromInt(5), 'Vendredi')
      assert.strictEqual(dateTranslator.getDayFromInt(6), 'Samedi')
      assert.strictEqual(dateTranslator.getDayFromInt(7), 'Dimanche')
    })

    it('should throw an "Unrecognized day number" Error', () => {
      assert.throws(() => { dateTranslator.getDayFromInt(0) }, Error, 'Unrecognized day number')
      assert.throws(() => { dateTranslator.getDayFromInt('definitely not an int') }, Error, 'Unrecognized day number')
    })
  })
})
