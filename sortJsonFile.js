import {FILE_PATH, readJsonFile, saveToJsonFile} from "./shared.js";

export const sortJsonFile = () => {
    const articles = readJsonFile(FILE_PATH);
    const sortedArticles = articles.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    saveToJsonFile(sortedArticles);
}
