import { saveArticles } from "./icMarketsScraper.js";
import puppeteer from "puppeteer";
import {sortJsonFile} from "./sortJsonFile.js";
import {formatSymbolName, POSSIBLE_TRADES, readJsonFile, scoreNext24HoursBias, uniqueSymbols} from "./shared.js";


/**
 * Main function
 * @returns {Promise<void>}
 */
const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: ['--disable-extensions'],
        userDataDir: './tmp',
    });
    const page = await browser.newPage();
    await saveArticles({
        page,
        scrapeAllPages: true,
        currentArticleListPageUrl: 'https://www.icmarkets.com/blog/category/fundamental-analysis/'
    });
    sortJsonFile();
    await browser.close();
};

/**
 * Find the possible trades for the given article and calculate the score for each possible trade
 * @param {Article} article
 * @returns {void}
 */
const scorePossibleTrades = () => {
    const articles = readJsonFile();
    for (const article of articles) {
        const possibleTradesFound = [];
        for (const leftSymbol of article.symbols) {
            for (const rightSymbol of article.symbols) {
                
                if (leftSymbol.symbol !== rightSymbol.symbol) { // TODO: bad naming
                    const formattedLeftSymbol = formatSymbolName(leftSymbol.symbol);
                    const formattedRightSymbol = formatSymbolName(rightSymbol.symbol);
                    if (POSSIBLE_TRADES.includes(`${formattedLeftSymbol}${formattedRightSymbol}`)) {
                        const leftSymbolScore = scoreNext24HoursBias(leftSymbol.next24HoursBias);
                        const rightSymbolScore = scoreNext24HoursBias(rightSymbol.next24HoursBias);
                        const score = leftSymbolScore + rightSymbolScore;
                        possibleTradesFound.push({
                            score,
                            leftSymbolScore,
                            rightSymbolScore,
                            leftSymbol: formattedLeftSymbol,
                            rightSymbol: formattedRightSymbol,
                            pair: `${formattedLeftSymbol}${formattedRightSymbol}`
                        });
                    }
                }
            }
        }
        article.possibleTrades = possibleTradesFound;
    }
    console.log(articles.map(article => article.possibleTrades));
}


// TODO
// - organize the code
// - separate the code into files
// run();
// sortJsonFile();
// uniqueSymbols();
scorePossibleTrades();
