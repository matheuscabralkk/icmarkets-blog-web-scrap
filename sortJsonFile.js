import {ARTICLES_FILE_PATH, readJsonFile, saveToJsonFile} from "./shared.js";

export const sortJsonFile = () => {
    const articles = readJsonFile(ARTICLES_FILE_PATH);
    const sortedArticles = articles.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    saveToJsonFile(sortedArticles, ARTICLES_FILE_PATH);
}
