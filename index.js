import { saveArticles } from "./icMarketsScraper.js";
import puppeteer from "puppeteer";
import {sortJsonFile} from "./sortJsonFile.js";
import {
    formatSymbolName,
    POSSIBLE_TRADES, SCORED_ARTICLES_FILE_PATH,
    readJsonFile,
    saveToJsonFile,
    scoreNext24HoursBias,
    uniqueSymbols
} from "./shared.js";


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
 * v1
 * Find the possible trades for the given article and calculate the score for each possible trade
 * @param {Article} article
 * @returns {void}
 */
const scorePossibleTradesV1 = () => {
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
    saveToJsonFile(articles, SCORED_ARTICLES_FILE_PATH);
    console.log(articles.map(article => article.possibleTrades));
}

/**
 * v2
 * Find the possible trades for the given article and calculate the score for each possible trade
 * @param {Article} article
 * @returns {void}
 */
const scorePossibleTradesV2 = () => {
    const articles = readJsonFile();
    let scoredArticles = [];
    for (const article of articles) {
        if (article.section === 'europe') {
            const scoredArticle = {
                date: article.date,
                possibleTrades: []
            }
            for (const leftSymbol of article.symbols) {
                for (const rightSymbol of article.symbols) {
                    if (leftSymbol.symbol !== rightSymbol.symbol) { // TODO: bad naming
                        const formattedLeftSymbol = formatSymbolName(leftSymbol.symbol);
                        const formattedRightSymbol = formatSymbolName(rightSymbol.symbol);
                        if (POSSIBLE_TRADES.includes(`${formattedLeftSymbol}${formattedRightSymbol}`)) {
                            const leftSymbolScore = scoreNext24HoursBias(leftSymbol.next24HoursBias);
                            const rightSymbolScore = scoreNext24HoursBias(rightSymbol.next24HoursBias);
                            const score = leftSymbolScore + rightSymbolScore;
                            scoredArticle.possibleTrades.push({
                                score,
                                leftSymbolScore,
                                rightSymbolScore,
                                leftSymbol: formattedLeftSymbol,
                                rightSymbol: formattedRightSymbol,
                                pair: `${formattedLeftSymbol}${formattedRightSymbol}`,
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


// TODO
// - organize the code
// - separate the code into files
// - get the possible trades from the ICMarkets fix api
// run();
// sortJsonFile();
// uniqueSymbols();
// scorePossibleTradesV1();
scorePossibleTradesV2();
