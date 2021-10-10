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
  Route.get('/week', 'WeekController.getCurrent').validator('RequireName')
  Route.get('/month', 'MonthController.getCurrent').validator('RequireName')

  // Get with specific date
  Route.get('/week/:date', 'WeekController.getByDate').validator('RequireName')

  // Get Microsoft Teams current links
  Route.get('/teams', 'TeamsController.get').validator('RequireName')

  // Route used by Calendz for background actualization
  Route.get('/week/:date/update', 'WeekController.updateByDate').validator('RequireName')
}).prefix('/v1')
