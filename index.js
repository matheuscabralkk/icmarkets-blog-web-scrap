import {sortJsonFile, uniqueCurrencies} from "./utils/shared.js";
import {scorePossibleTrades} from "./mainFunctionalities/scorePossibleTrades.js";
import {runWebScrapping} from "./mainFunctionalities/icMarketsScraper.js";


// TODO
// - get the possible trades from the ICMarkets fix api
// runWebScrapping();
// sortJsonFile();
// uniqueCurrencies();
scorePossibleTrades();
