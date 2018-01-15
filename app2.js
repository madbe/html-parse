const scraper = require('./routes/scraper');
const fs = require('fs');
const baseUrl = 'http://prices.shufersal.co.il';
const path = 'prices.json';


// Promise example
scraper.urlsScraper(baseUrl)
  .then((data) => {
    console.log('data from scraper received ');
    fs.writeFile(path, JSON.stringify(data), (error) => {
      if(error) {
        console.log(error);
      }
      console.log('Successfully wrote to ' + path);
    })
  })
  .catch((error) => {
    console.log('error scraping data');
  })
