import fs from 'fs';

export const ARTICLES_FILE_PATH = '../db/articles.json'

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
 * Returns unique currencies
 * @returns {string[]}
 */
export const uniqueCurrencies = () => {
    // read the file
    const file = fs.readFileSync(ARTICLES_FILE_PATH);
    // parse the file
    /** @type {Article[]} */
    const articles = JSON.parse(file);
    const currencies = [];
    for (const article of articles) {
        for (const currency of article.currencies) {
            currencies.push(currency.currencyName);
        }
    }
    const uniqueCurrencies = [...new Set(currencies)];
    return uniqueCurrencies;
}

export const sortJsonFile = () => {
    const articles = readJsonFile(ARTICLES_FILE_PATH);
    const sortedArticles = articles.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    saveToJsonFile(sortedArticles, ARTICLES_FILE_PATH);
}
