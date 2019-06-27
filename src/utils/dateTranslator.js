module.exports = {
  getMonth: (month) => {
    switch (month.toLowerCase()) {
      case 'jan':
        return '01'
      case 'feb':
        return '02'
      case 'mar':
        return '03'
      case 'api':
        return '04'
      case 'may':
        return '05'
      case 'jun':
        return '06'
      case 'jul':
        return '07'
      case 'aug':
        return '08'
      case 'sep':
        return '09'
      case 'oct':
        return '10'
      case 'nov':
        return '11'
      case 'dec':
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
  }
}
