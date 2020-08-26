'use strict'

const { test } = use('Test/Suite')('DateUtils Provider')
const DateUtils = use('DateUtils')

// ==================================
// == #getMonth
// ==================================

test('should translate months to numbers', ({ assert }) => {
  assert.strictEqual(DateUtils.getMonth('janvier'), '01')
  assert.strictEqual(DateUtils.getMonth('février'), '02')
  assert.strictEqual(DateUtils.getMonth('mars'), '03')
  assert.strictEqual(DateUtils.getMonth('avril'), '04')
  assert.strictEqual(DateUtils.getMonth('mai'), '05')
  assert.strictEqual(DateUtils.getMonth('juin'), '06')
  assert.strictEqual(DateUtils.getMonth('juillet'), '07')
  assert.strictEqual(DateUtils.getMonth('aout'), '08')
  assert.strictEqual(DateUtils.getMonth('septembre'), '09')
  assert.strictEqual(DateUtils.getMonth('octobre'), '10')
  assert.strictEqual(DateUtils.getMonth('novembre'), '11')
  assert.strictEqual(DateUtils.getMonth('décembre'), '12')
})

test('should throw an "Unrecognized month name" Error', ({ assert }) => {
  assert.throws(() => { DateUtils.getMonth('not a valid month') }, Error, 'Unrecognized month name')
})

// ==================================
// == #getDayFromString
// ==================================

test('should return the day included in the string', ({ assert }) => {
  assert.strictEqual(DateUtils.getDayFromString('sazeeluNDi aze'), 'lundi')
  assert.strictEqual(DateUtils.getDayFromString('phazeMardiaaze'), 'mardi')
  assert.strictEqual(DateUtils.getDayFromString('azemerCREDIaze'), 'mercredi')
  assert.strictEqual(DateUtils.getDayFromString('aa jeudiazeaze'), 'jeudi')
  assert.strictEqual(DateUtils.getDayFromString('A jVendREdi az'), 'vendredi')
  assert.strictEqual(DateUtils.getDayFromString('azeuhyiSAmEDIa'), 'samedi')
  assert.strictEqual(DateUtils.getDayFromString('azeDimaNche ez'), 'dimanche')
})

test('should throw an "Unknown day" Error', ({ assert }) => {
  assert.throws(() => { DateUtils.getDayFromString('thereAre noDaYInTHiSString') }, Error, 'Unknown day')
})

// ==================================
// == #getDayFromInt
// ==================================

test('should return isoWeekDay', ({ assert }) => {
  assert.strictEqual(DateUtils.getDayFromInt(1), 'Lundi')
  assert.strictEqual(DateUtils.getDayFromInt(2), 'Mardi')
  assert.strictEqual(DateUtils.getDayFromInt(3), 'Mercredi')
  assert.strictEqual(DateUtils.getDayFromInt(4), 'Jeudi')
  assert.strictEqual(DateUtils.getDayFromInt(5), 'Vendredi')
  assert.strictEqual(DateUtils.getDayFromInt(6), 'Samedi')
  assert.strictEqual(DateUtils.getDayFromInt(7), 'Dimanche')
})

test('should throw an "Unrecognized day number" Error', ({ assert }) => {
  assert.throws(() => { DateUtils.getDayFromInt(0) }, Error, 'Unrecognized day number')
  assert.throws(() => { DateUtils.getDayFromInt('definitely not an int') }, Error, 'Unrecognized day number')
})

// ==================================
// == #getWeekNumber
// ==================================

test('should return week number from date', ({ assert }) => {
  let date
  date = new Date('2020-01-01')
  assert.deepEqual(DateUtils.getWeekNumber(date), { year: 2020, number: 1 })
  date = new Date('2020-01-08')
  assert.deepEqual(DateUtils.getWeekNumber(date), { year: 2020, number: 2 })
  date = new Date('2020-05-25')
  assert.deepEqual(DateUtils.getWeekNumber(date), { year: 2020, number: 22 })
})

// ==================================
// == #isValid
// ==================================

test('should check that date has valid MM/DD/YY format', ({ assert }) => {
  let date
  date = '01/01/20'
  assert.isTrue(DateUtils.isValid(date))
  date = '01/20/2020'
  assert.isTrue(DateUtils.isValid(date))
  date = '01-01-2020'
  assert.isTrue(DateUtils.isValid(date))
})

test('should check that date doesn\'t have valid MM/DD/YY format', ({ assert }) => {
  let date
  date = '20/01/20'
  assert.isFalse(DateUtils.isValid(date))
  date = '20/01/2020'
  assert.isFalse(DateUtils.isValid(date))
})
