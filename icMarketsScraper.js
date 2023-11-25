import path from 'path';
import {ARTICLES_FILE_PATH, readJsonFile, saveToJsonFile} from "./shared.js";
import fs from "fs";
const dirPath = path.resolve('../db');
const filePath = path.resolve(dirPath, 'articles.json');

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


/**
 * Scrap the forecast article
 * @param page
 * @param article
 * @returns {Promise<void>}
 */
async function scrapForecastArticle(page, article) {
    await navTo(page, article.url);
    await waitFor(2000);

    // Get the date
    article.dateStr = await page.$eval('.ssc-content time', time => time.getAttribute("datetime"));
    article.date = new Date(article.dateStr);


    /**
     * Current section of the article
     * @type {('what happened in'|'what does it mean for the'|'symbols')}
     */
    let currentArticleSection;
    /**
     * Current symbol of the article
     * @type {('USD'|'XAU'|'XAG'|'EUR'|'GBP'|'JPY'|'AUD'|'NZD'|'CAD'|'CHF')}
     */
    let currentSymbol;

    /**
     * Current symbol section of the article
     * @type {('key news events today'|'what can we expect today'|'next 24 hours bias'|'central bank notes')}
     */
    let currentSymbolSection;
    const contents = await page.$$('.the-post-content-container > *');
    let i = 0;
    let changingSymbol = false;
    for (const content of contents) {
        // check if the node has a text
        const text = await content.evaluate(node => node.innerText);
        const tagName = await content.evaluate(node => node.tagName);
        if (text?.toLowerCase().includes('what happened in')) {
            currentArticleSection = 'what happened in';
            continue;
        } else if (text?.toLowerCase().includes('what does it mean for the')) {
            currentArticleSection = 'what does it mean for the';
            continue;
        } else if (text?.toLowerCase().includes('the dollar index (dxy)') || changingSymbol) {
            const textSymbol = text?.toLowerCase();
            changingSymbol = false;
            currentArticleSection = 'symbols';
            currentSymbol = textSymbol?.includes('dollar index') ? 'USD' : text
            article.symbols.push({
                symbol: currentSymbol,
                articleSymbol: currentSymbol,
                keyNewsEventsToday: [],
                whatCanWeExpect: [],
                centralBankNotes: [],
                next24HoursBias: undefined
            });
            continue;
        } else if (tagName === 'HR') {
            changingSymbol = true;
            continue;
        } else if (text?.toLowerCase().includes('key news events today')) {
            currentSymbolSection = 'key news events today';
            continue;
        } else if (text?.toLowerCase().includes('what can we expect from')) {
            currentSymbolSection = 'what can we expect today';
            continue;
        } else if (text?.toLowerCase().includes('central bank notes')) {
            currentSymbolSection = 'central bank notes';
            continue;
        } else if (text?.toLowerCase().includes('next 24 hours bias')) {
            currentSymbolSection = 'next 24 hours bias';
            continue;
        }

        const symbolIndex = article.symbols.length - 1;
        if (currentArticleSection === 'what happened in') article.whatHappened.push(text);
        if (currentArticleSection === 'what does it mean for the') article.whatDoesItMean.push(text);
        if (currentArticleSection === 'symbols') {
            if (currentSymbolSection === 'key news events today') article.symbols[symbolIndex].keyNewsEventsToday.push(text);
            if (currentSymbolSection === 'what can we expect today') article.symbols[symbolIndex].whatCanWeExpect.push(text);
            if (currentSymbolSection === 'central bank notes') article.symbols[symbolIndex].centralBankNotes.push(text);
            if (currentSymbolSection === 'next 24 hours bias') article.symbols[symbolIndex].next24HoursBias = text;
        }
        console.log(article);
        i++;
    }
}

const createJsonFileIfNotExist = () => {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // create the file if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
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

    // const test = readJsonFile();
    // console.log(test.map(article => article.title));
    // process.exit(0);

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
                const jsonArticle = {
                    title: undefined,
                    url: undefined,
                    section: undefined,
                    articleType: undefined,
                    dateStr: undefined,
                    date: undefined,
                    subtitle: undefined,
                    whatHappened: [],
                    whatDoesItMean: [],
                    symbols: []
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
            await waitFor(5000);
            const nextPageUrl = await page.url();
            await saveArticles({
                page,
                currentArticleListPageUrl: nextPageUrl,
                scrapeAllPages: true
            });
        }

    }
};

export { saveArticles };
