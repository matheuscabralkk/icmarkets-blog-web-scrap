/**
 * @typedef {Object} Symbol
 * @property {('USD'|'XAU'|'XAG'|'EUR'|'GBP'|'JPY'|'AUD'|'NZD'|'CAD'|'CHF')} symbol
 * @property {string} articleSymbol
 * @property {string[]} keyNewsEventsToday
 * @property {string[]} whatCanWeExpect
 * @property {string[]} centralBankNotes
 * @property {Next24HoursBias} next24HoursBias
 */

/**
 * @typedef {Object} Article
 * @property {string} title
 * @property {string} url
 * @property {('forecast'|'analysis')} articleType
 * @property {('europe'|'asia')} section
 * @property {string} dateStr
 * @property {Date} date
 * @property {string} subtitle
 * @property {string[]} whatHappened
 * @property {string[]} whatDoesItMean
 * @property {Symbol[]} symbols
 * @property {PossibleTrade[]} [possibleTrades] - optional
 */

/**
 * @type {Article[]}
 */

/**
 * @typedef {Object} PossibleTrade
 * @property {string} leftSymbol
 * @property {string} rightSymbol
 * @property {string} pair
 * @property {number} score
 * @property {number} leftSymbolScore
 * @property {number} rightSymbolScore
 */

/**
 * @typedef {('Strong Bullish'|'Medium Bullish'|'Weak Bullish'|'Neutral'|'Bearish'|'Medium Bearish'|'Strong Bearish'|undefined)} Next24HoursBias
 */
