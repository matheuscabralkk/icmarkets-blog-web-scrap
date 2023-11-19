Node App to Scrape and Save Articles from IC Markets Forex News
====================================

This node application focuses on scraping article data from IC Markets forecasts and storing the extracted data on a local JSON file.

Setup
-----


1. Run `npm install` to install all the project dependencies.

Functionality
-------------

The major highlights of the application are listed below:

1. It uses Puppeteer to scrape data from a IC Markets Forex Forecasts. 
2. It saves this data into a JSON file in the 'db' directory at the root of the project. 
3. It scrapes various sections of the article.

## Features

| Feature                      | Status              |
|------------------------------|---------------------|
| Scrap Forecasts Article      | ✅            |
| Scrap Analysis Articles      | ❌ |
| Scrap Considering Pagination | ❌ |


Running the Application
-----------------------

Make sure you have installed the dependencies using `npm install` in your terminal/command prompt. You can run the application by executing `npm start` in the project's root folder. The application will open a Puppeteer browser instance, navigate to the target website, scrape the articles, and store them in a local JSON file.
