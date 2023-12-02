import {readJsonFile, saveToJsonFile} from "../utils/shared.js";
import {
    bearBearScore,
    bearBullScore,
    bearNeutralScore,
    bullBearScore,
    bullBullScore,
    bullNeutralScore, neutralBearScore, neutralBullScore, neutralNeutralScore
} from "../utils/scoreCalcUtils.js";

/**
 * v2
 * Find the possible trades for the given article and calculate the score for each possible trade
 * @returns {void}
 */

const SCORED_ARTICLES_FILE_PATH = '../db/scoredArticles.json'

export const POSSIBLE_TRADES = [
    // CURRENCIES
    'EURUSD',
    'AUDUSD',
    'GBPUSD',
    'USDCAD',
    'USDCHF',
    'USDJPY',
    'AUDCAD',
    'AUDCHF',
    'AUDJPY',
    'AUDNZD',
    'CADJPY',
    'CADCHF',
    'AUDSGD',
    'EURAUD',
    'EURCAD',
    'EURCHF',
    'EURDKK',
    'EURHKD',
    'EURGBP',
    'EURJPY',
    'EURNOK',
    'EURNZD',
    'EURPLN',
    'EURSEK',
    'EURSGD',
    'EURTRY',
    'EURZAR',
    'GBPAUD',
    'GBPCAD',
    'GBPCHF',
    'GBPJPY',
    'GBPNOK',
    'GBPNZD',
    'GBPSGD',
    'GBPDKK',
    'GBPSEK',
    'NOKJPY',
    'NOKSEK',
    'NZDCAD',
    'NZDCHF',
    'NZDJPY',
    'NZDUSD',
    'SEKJPY',
    'SGDJPY',
    'USDCNH',
    'USDCZK',
    'USDDKK',
    'USDHKD',
    'USDHUF',
    'USDMXN',
    'USDNOK',
    'USDPLN',
    'USDRUB',
    'USDSEK',
    'USDSGD',
    'USDTHB',
    'USDTRY',
    'USDZAR',
    'GBPTRY',
    // OIL
    'XTIUSD',
    'XBRUSD',
    // METALS
    'XAGEUR',
    'XAGUSD',
    'XAUEUR',
    'XAUUSD',
    'XPDUSD',
    'XPTUSD',
    'XAGAUD',
    'XAUCHF',
    'XAUGBP',
    'XAUJPY',
    'XAGAUD',
    // INDICES
    'AUS200',
    'STOXX50',
    'F40',
    'DE30',
    'HK50',
    'IT40',
    'JP225',
    'ES35',
    'UK100',
    'US2000',
    'US500',
    'USTEC',
    'US30',
    'CHINA50',
    'CA60',
    'TecDE30',
    'MidDE60',
    'NETH25',
    'SWI20',
    'CHINAH',
    'NOR25',
    'SA40',
    'MidDE50',
    'DE40',
    // COMMODITIES
    'XNGUSD',
    // CRYPTO
    'BTCUSD',
    'DSHUSD',
    'BCHUSD',
    'ETHUSD',
    'LTCUSD',
];

/**
 * Returns the score
 * @param {Next24HoursBias} leftSymbolNext24HoursBias
 * @param {Next24HoursBias} rightSymbolNext24HoursBias
 * @typedef {score: number, scoreDirection: ScoreDirection, leftSymbolScore: number, rightSymbolScore: number, leftSymbolDirection: } ScoreNext24HoursBiasReturn
 * @returns {ScoreNext24HoursBiasReturn}
 */
const scoreNext24HoursBias = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    leftSymbolNext24HoursBias = leftSymbolNext24HoursBias?.trim().toLowerCase() || '';
    rightSymbolNext24HoursBias = rightSymbolNext24HoursBias?.trim().toLowerCase() || '';

    if (leftSymbolNext24HoursBias.includes('bullish')) {
        if (rightSymbolNext24HoursBias.includes('bearish')) {
            return bullBearScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else if (rightSymbolNext24HoursBias.includes('bullish')) {
            return bullBullScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else if (!rightSymbolNext24HoursBias || (rightSymbolNext24HoursBias && rightSymbolNext24HoursBias.includes('mixed'))) {
            return bullNeutralScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else {
            throw new Error(`Invalid rightSymbolNext24HoursBias in left bull: ${rightSymbolNext24HoursBias}`);
        }
        throw new Error(`Invalid leftSymbolNext24HoursBias in left bull: ${leftSymbolNext24HoursBias}`);
    } else if (leftSymbolNext24HoursBias.includes('bearish')) {
        if (rightSymbolNext24HoursBias.includes('bullish')) {
            return bearBullScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else if (rightSymbolNext24HoursBias.includes('bearish')) {
            return bearBearScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else if (!rightSymbolNext24HoursBias || (rightSymbolNext24HoursBias && rightSymbolNext24HoursBias.includes('mixed'))) {
            return bearNeutralScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else {
            throw new Error(`Invalid rightSymbolNext24HoursBias in left bear: ${rightSymbolNext24HoursBias}`);
        }
        throw new Error(`Invalid leftSymbolNext24HoursBias in left bear: ${leftSymbolNext24HoursBias}`);
    } else if (!leftSymbolNext24HoursBias || (leftSymbolNext24HoursBias && leftSymbolNext24HoursBias.includes('mixed'))) {
        if (rightSymbolNext24HoursBias.includes('bullish')) {
            return neutralBullScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else if (rightSymbolNext24HoursBias.includes('bearish')) {
            return neutralBearScore(leftSymbolNext24HoursBias, rightSymbolNext24HoursBias)
        } else if (!rightSymbolNext24HoursBias || (rightSymbolNext24HoursBias && rightSymbolNext24HoursBias.includes('mixed'))) {
            return neutralNeutralScore()
        } else {
            throw new Error(`Invalid rightSymbolNext24HoursBias in left mixed: ${rightSymbolNext24HoursBias}`);
        }
        throw new Error(`Invalid leftSymbolNext24HoursBias in left mixed: ${leftSymbolNext24HoursBias}`);
    } else {
        throw new Error(`Invalid leftSymbolNext24HoursBias: ${leftSymbolNext24HoursBias}`);
    }
}

export const scorePossibleTrades = () => {
    const articles = readJsonFile();
    let scoredArticles = [];
    for (const article of articles) {
        if (article.section === 'europe') {
            const scoredArticle = {
                date: article.date,
                possibleTrades: []
            }

            for (const leftCurrency of article.currencies) {
                for (const rightCurrency of article.currencies) {
                    if (leftCurrency.currencyName !== rightCurrency.currencyName) {
                        if (POSSIBLE_TRADES.includes(`${leftCurrency.currencyName}${rightCurrency.currencyName}`)) {
                            const {
                                leftCurrencyScore,
                                rightCurrencyScore,
                                score,
                                scoreDirection,
                                leftCurrencyDirection,
                                rightCurrencyDirection
                            } = scoreNext24HoursBias(leftCurrency.next24HoursBias, rightCurrency.next24HoursBias)

                            scoredArticle.possibleTrades.push({
                                score: score ?? 0,
                                scoreDirection: scoreDirection ?? 'neutral',
                                leftCurrencyScore: leftCurrencyScore ?? 0,
                                rightCurrencyScore: rightCurrencyScore ?? 0,
                                leftCurrencyDirection: leftCurrencyDirection ?? 'neutral',
                                rightCurrencyDirection: rightCurrencyDirection ?? 'neutral',
                                leftCurrency: leftCurrency.currencyName,
                                rightCurrency: rightCurrency.currencyName,
                                pair: `${leftCurrency.currencyName}${rightCurrency.currencyName}`,
                            });
                        }
                    }
                }
            }
            // sort possible trades by score
            scoredArticle.possibleTrades = scoredArticle.possibleTrades.sort((a, b) => b.score - a.score);
            scoredArticles.push(scoredArticle);
        }
    }
    // sort possible trades by date
    scoredArticles = scoredArticles.sort((a, b) => a.date - b.date);

    saveToJsonFile(scoredArticles, SCORED_ARTICLES_FILE_PATH);
}
