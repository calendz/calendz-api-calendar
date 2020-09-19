'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const packageJson = require('../package.json')

const Route = use('Route')

Route.get('/', () => ({ version: packageJson.version, uptime: process.uptime() }))

// Parsing calendar
Route.group(() => {
  // Get with current date
  Route.get('/day', 'DayController.getCurrent').validator('RequireName')
  Route.get('/week', 'WeekController.getCurrent').validator('RequireName')

  // Get with specific date
  Route.get('/day/:date', 'DayController.getByDate').validator('RequireName')
  Route.get('/week/:date', 'WeekController.getByDate').validator('RequireName')

  // Routes use by Calendz for background actualization
  Route.get('/week/:date/update', 'WeekController.updateByDate').validator('RequireName')
}).prefix('/v1')
