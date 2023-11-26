/**
 * @typedef {Object} Insight
 * @property {string} title
 * @property {Array<string>} paragraphs
 */

/**
 * @typedef {Object} Currency
 * @property {('USD'|'XAU'|'XAG'|'EUR'|'GBP'|'JPY'|'AUD'|'NZD'|'CAD'|'CHF')} currencyName
 * @property {string} articleCurrency
 * @property {Insight[]} currencyInsights
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
 * @property {Insight[]} articleInsights
 * @property {Currency[]} currencies
 */

/**
 * @type {Article[]}
 */

/**
 * @typedef {Object} PossibleTrade
 * @property {string} leftCurrency
 * @property {string} rightCurrency
 * @property {string} pair
 * @property {number} score
 * @property {number} leftCurrencyScore
 * @property {number} rightCurrencyScore
 */

/**
 * @typedef {('Strong Bullish'|'Medium Bullish'|'Weak Bullish'|'Neutral'|'Bearish'|'Medium Bearish'|'Strong Bearish'|undefined)} Next24HoursBias
 */


/**
 * @typedef {('long'|'short'|'neutral')} ScoreDirection
 */
