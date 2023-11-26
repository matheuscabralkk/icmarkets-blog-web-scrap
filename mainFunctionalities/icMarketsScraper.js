import path from 'path';
import {ARTICLES_FILE_PATH, readJsonFile, saveToJsonFile, sortJsonFile} from "../utils/shared.js";
import fs from "fs";
import puppeteer from "puppeteer";

const DB_PATH = path.resolve('../db');
const FILE_NAME = path.resolve(DB_PATH, 'articles.json');


/**
 * Returns the formatted symbol name
 * @returns {string}
 */
export const formatCurrencyName = (currency) => {
    currency = currency?.trim() || '';
    if (currency === 'The Dollar Index (DXY)') return 'USD';
    if (currency === 'Gold (XAU)') return 'XAU';
    if (currency === 'The Australian Dollar (AUD)') return 'AUD';
    if (currency === 'The Kiwi Dollar (NZD)') return 'NZD';
    if (currency === 'The Japanese Yen (JPY)') return 'JPY';
    if (currency === 'The Euro (EUR)') return 'EUR';
    if (currency === 'The Swiss Franc (CHF)') return 'CHF';
    if (currency === 'The Pound (GBP)') return 'GBP';
    if (currency === 'The Canadian Dollar (CAD)') return 'CAD';
    if (currency === 'Oil') return 'XTI';
    throw new Error(`Invalid symbol: ${currency}`);
}

/**
 * Get the article section based on the title
 * @param title
 * @returns {('europe'|'asia')}
 */
const getArticleSection = (title) => {
    if (title && title.toLowerCase().includes('europe')) {
        return 'europe';
    } else if (title && title.toLowerCase().includes('asia')) {
        return 'asia';
    }
    throw new Error('Article section not found');
};

/**
 * Wait for the given time
 * @param ms
 * @returns {Promise<unknown>}
 */
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Navigate to the given url
 * @param page
 * @param url
 * @returns {Promise<void>}
 */
const navTo = async (page, url) => {
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
}

const formatToCompare = (str) => {
    // remove all spaces
    const formattedStr = str.replace(/\s/g, '');
    // to lower case
    return formattedStr.toLowerCase();
}



const createJsonFileIfNotExist = () => {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(DB_PATH)){
        fs.mkdirSync(DB_PATH, { recursive: true });
    }

    // create the file if it doesn't exist
    if (!fs.existsSync(FILE_NAME)) {
        fs.writeFileSync(FILE_NAME, JSON.stringify([]));
    }
}
/**
 * Pushes the given article to the json file and saves it
 * @param article
 */
const pushAndSaveToJsonFile = (article) => {
    const file = fs.readFileSync(ARTICLES_FILE_PATH);
    const articles = JSON.parse(file);
    articles.push(article);
    saveToJsonFile(articles, ARTICLES_FILE_PATH);
}

/**
 * Main function to scrape and save the articles
 * @returns {Promise<void>}
 */
const saveArticles = async ({ scrapeAllPages, page, currentArticleListPageUrl}) => {
    await navTo(page, currentArticleListPageUrl);

    createJsonFileIfNotExist();
    const savedArticles = readJsonFile();
    const articles = await page.$$(".ssc-content .col-md-4")
    /**
     * @type {Article[]}
     */
    const jsonArticles = [];
    for (const article of articles) {
        try {
            const title = await article.$eval('h5 > a', h2 => h2.innerText);
            const url = await article.$eval('a', a => a.href);
            const isForecastArticle = title && title.toLowerCase().includes('forecast');
            if (isForecastArticle) {
                /**
                 * @type {Article}
                 */
                const jsonArticle = {
                    title: undefined,
                    url: undefined,
                    section: undefined,
                    articleType: undefined,
                    dateStr: undefined,
                    date: undefined,
                    subtitle: undefined,
                    articleInsights: [],
                    currencies: [],
                }
                jsonArticle.title = title;
                jsonArticle.url = url;
                jsonArticle.articleType = 'forecast';
                jsonArticle.section = getArticleSection(title);
                jsonArticles.push(jsonArticle);
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }


    for (const article of jsonArticles) {
        try {
            if (article.articleType === 'forecast') {
                if (savedArticles.map(article => article.title).includes(article.title)) continue;
                await scrapForecastArticle(page, article);
                pushAndSaveToJsonFile(article);
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
    if (scrapeAllPages) {
        const currentUrl = await page.url();
        if(currentUrl !== currentArticleListPageUrl) await navTo(page, currentArticleListPageUrl);
        const nextButton = await page.$('.next');
        if (nextButton) {
            await nextButton.click();
            await waitFor(3000);
            const nextPageUrl = await page.url();
            await saveArticles({
                page,
                currentArticleListPageUrl: nextPageUrl,
                scrapeAllPages: true
            });
        }

    }
};

/**
 * Scrap the forecast article
 * @param page
 * @param article
 * @returns {Promise<void>}
 */
async function scrapForecastArticle(page, article) {
    await navTo(page, article.url);
    await waitFor(2000);

    article.dateStr = await page.$eval('.ssc-content time', time => time.getAttribute("datetime"));
    article.date = new Date(article.dateStr);

    const contents = await page.$$('.the-post-content-container > *');

    // get all innerText inside p > strong tags
    const titles = await page.$$eval('.the-post-content-container > * > strong', nodes => nodes.map(node => node.innerText));

    const isNext24HoursBiasTitle = (contentText) => {
        if (formatToCompare(contentText).includes('next24hoursbias')) return true;
    }

    // The Dollar Index (DXY) title
    const isUsdTitle = (contentText) => {
        const test1 = formatToCompare(contentText).includes('dollarindex');
        const test2 = formatToCompare(contentText).includes('(dxy)');
        const test3 = formatToCompare(contentText).includes('(usd)');
        return test1 || test2 || test3;
    }

    for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        const contentText = await content.evaluate(node => node.innerText)

        // 1 - extract first element - which is the article subtitle
        if (i === 0) {
            article.subtitle = contentText;
            continue;
        }

        if (!article.currencies.length) {
            // 2 - extract article insights (what happened, what does it mean)
            if (titles.includes(contentText) && !isUsdTitle(contentText)) {
                article.articleInsights.push({
                    title: contentText,
                    paragraphs: []
                });
                continue;
            } else if (!titles.includes(contentText)) {
                const currentArticleInsight = article.articleInsights[article.articleInsights.length - 1];
                currentArticleInsight.paragraphs.push(contentText);
                continue;
            }
            // article insights extraction is done
        }

        const previousContent = contents[i - 1];
        const previousTagName = await previousContent.evaluate(node => node.tagName);
        const previousWasHr = previousTagName === 'HR';

        // 3 - extract currencies - it is the first element after a HR or the first element of the article insights
        if ((titles.includes(contentText) && previousWasHr) || (titles.includes(contentText) && isUsdTitle(contentText))) {
            article.currencies.push({
                currencyName: formatCurrencyName(contentText),
                articleCurrency: contentText,
                currencyInsights: [],
                next24HoursBias: undefined
            });
            continue;
        }
        if (!article.currencies.length) throw new Error('Should have at least one currency. contentText: ' + contentText);
        const lastCurrency = article.currencies[article.currencies.length - 1];
        if (titles.includes(contentText) && !isNext24HoursBiasTitle(contentText)) {
            lastCurrency.currencyInsights.push({
                title: contentText,
                paragraphs: []
            });
        } else if (!titles.includes(contentText)) {
            const currentCurrencyInsight = lastCurrency.currencyInsights[lastCurrency.currencyInsights.length - 1];
            currentCurrencyInsight.paragraphs.push(contentText);
        } else if (isNext24HoursBiasTitle(contentText)) {
            const nextContentText = await contents[i + 1].evaluate(node => node.innerText);
            if (!nextContentText) throw new Error('Next content text not found');
            lastCurrency.next24HoursBias = nextContentText;
        } else {
            throw new Error('Should not reach here');
        }
    }
}

/**
 * Main function
 * @returns {Promise<void>}
 */
const runWebScrapping = async () => {
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


export { runWebScrapping };
