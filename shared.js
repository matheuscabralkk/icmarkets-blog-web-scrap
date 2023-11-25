import fs from 'fs';

export const ARTICLES_FILE_PATH = '../db/articles.json'
export const SCORED_ARTICLES_FILE_PATH = '../db/scoredArticles.json'
//     if (symbol === 'USD') return 'USD';
//     if (symbol === 'Gold (XAU)') return 'XAU';
//     if (symbol === 'The Australian Dollar (AUD)') return 'AUD';
//     if (symbol === 'The Kiwi Dollar (NZD)') return 'NZD';
//     if (symbol === 'The Japanese Yen (JPY)') return 'JPY';
//     if (symbol === 'The Euro (EUR)') return 'EUR';
//     if (symbol === 'The Swiss Franc (CHF)') return 'CHF';
//     if (symbol === 'The Pound (GBP)') return 'GBP';
//     if (symbol === 'The Canadian Dollar (CAD)') return 'CAD';
//     if (symbol === 'Oil') return 'XTI';
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
 * Save the given json article to the json file
 * @param {json} articles
 */
export const saveToJsonFile = (articles, filePath) => {
    fs.writeFileSync(filePath, JSON.stringify(articles));
};

/**
 * Read the json file
 * @returns {Article[]}
 */
export const readJsonFile = () => {
    // read the file
    const file = fs.readFileSync(ARTICLES_FILE_PATH);
    // parse the file
    return JSON.parse(file);
}

/**
 * Returns unique symbols
 * @returns {string[]}
 */
export const uniqueSymbols = () => {
    // read the file
    const file = fs.readFileSync(ARTICLES_FILE_PATH);
    // parse the file
    const articles = JSON.parse(file);
    const symbols = [];
    for (const article of articles) {
        for (const symbol of article.symbols) {
            symbols.push(symbol.symbol); // todo: rethink the symbol structure - same name
        }
    }
    // removes duplicate
    const uniqueSymbols = [...new Set(symbols)];
    console.log(uniqueSymbols);
    return uniqueSymbols;
}

export const formattedSymbols = () => {
    
}


/**
 * Returns the formatted symbol name
 * @returns {string}
 */
export const formatSymbolName = (symbol) => {
    if (symbol === 'USD') return 'USD';
    if (symbol === 'Gold (XAU)') return 'XAU';
    if (symbol === 'The Australian Dollar (AUD)') return 'AUD';
    if (symbol === 'The Kiwi Dollar (NZD)') return 'NZD';
    if (symbol === 'The Japanese Yen (JPY)') return 'JPY';
    if (symbol === 'The Euro (EUR)') return 'EUR';
    if (symbol === 'The Swiss Franc (CHF)') return 'CHF';
    if (symbol === 'The Pound (GBP)') return 'GBP';
    if (symbol === 'The Canadian Dollar (CAD)') return 'CAD';
    if (symbol === 'Oil') return 'XTI';
    throw new Error(`Invalid symbol: ${symbol}`);
}

/**
 * Returns the score
 * @param {Next24HoursBias} next24HoursBias
 */
export const scoreNext24HoursBias = (next24HoursBias) => {
    next24HoursBias = next24HoursBias?.trim();
    try {
        if (next24HoursBias === 'Strong Bullish' || next24HoursBias === 'Strong Bearish') return 3;
        if (next24HoursBias === 'Medium Bullish' || next24HoursBias === 'Medium Bearish') return 2;
        if (next24HoursBias === 'Weak Bullish' || next24HoursBias === 'Weak Bearish') return 1;
        if (next24HoursBias === 'Neutral' || next24HoursBias === undefined) return 0;
    } catch (e) {
        throw new Error('Invalid next24HoursBias');
    }
}
