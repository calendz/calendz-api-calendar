module.exports = {
  getMonth: (month) => {
    switch (month.toLowerCase()) {
      case 'janvier':
        return '01'
      case 'février':
        return '02'
      case 'mars':
        return '03'
      case 'avril':
        return '04'
      case 'mai':
        return '05'
      case 'juin':
        return '06'
      case 'juillet':
        return '07'
      case 'aout':
        return '08'
      case 'septembre':
        return '09'
      case 'octobre':
        return '10'
      case 'novembre':
        return '11'
      case 'décembre':
        return '12'
      default:
        throw new Error('Unrecognized month name')
    }
  },

  getDayFromString: (day) => {
    if (day.toLowerCase().includes('lundi')) {
      return 'lundi'
    } else if (day.toLowerCase().includes('mardi')) {
      return 'mardi'
    } else if (day.toLowerCase().includes('mercredi')) {
      return 'mercredi'
    } else if (day.toLowerCase().includes('jeudi')) {
      return 'jeudi'
    } else if (day.toLowerCase().includes('vendredi')) {
      return 'vendredi'
    } else if (day.toLowerCase().includes('samedi')) {
      return 'samedi'
    } else if (day.toLowerCase().includes('dimanche')) {
      return 'dimanche'
    } else {
      throw new Error('Unknown day')
    }
  },

  getDayFromInt: (day) => {
    switch (day) {
      case 1:
        return 'Lundi'
      case 2:
        return 'Mardi'
      case 3:
        return 'Mercredi'
      case 4:
        return 'Jeudi'
      case 5:
        return 'Vendredi'
      case 6:
        return 'Samedi'
      case 7:
        return 'Dimanche'
      default:
        throw new Error('Unrecognized day number')
    }
  },

  getWeekNumber: (date) => {
    // Copy date so don't modify original
    date = new Date(date)
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
    // Get first day of year
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
    // Return array of year and week number

    return { year: date.getUTCFullYear(), number: weekNo }
  }
}
