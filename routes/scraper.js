const request = require('request');
const cheerio = require('cheerio');

//Scraping with Promise and cheerio
urlsScraper = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {

      if (error) {
        reject(error);
      }

      let $ = cheerio.load(body);
      let $url = url;
      let prices = [];
      let pages = [];

      prices.push({
          url: $url
      });

      pages.push($url);
      prices.concat(dataScraper($, pages));
      console.log('first result ' + prices);

      $('tfoot tr.webgrid-footer td a').each(function(i){
          let text = $(this).text();
          let href = $(this).attr("href");
          if(text != null && text === ">"){
              pages.push(url + href);
              prices.concat(dataScraper($, pages));
          }
      });
        console.log('result ' + prices.join(','));
      // console.log(pages)


      // respond with the final JSON
      console.log('scraped from scraper.js ', prices);
      resolve(prices);

    })
  })
};

dataScraper = ($, urlPage) => {
    if (!urlPage.length) { return; }

    let currentPage = urlPage.pop();
    let data = [];
    request(currentPage, (error, res, body) => {

      if(error){
        console.log(error);
        return;
      }

      $('table.webgrid tbody tr').each(function (i) {
          let $gzDownloadUrl = $(this).find('td a').attr('href');
          let $updateTime = $(this).find('td').eq(1).text();
          let $storeName = $(this).find('td').eq(5).text();
          let $priceId = $(this).find('td').eq(6).text();

          data.push({
              no: i + 1,
              priceId: $priceId,
              gzDownloadUrl: $gzDownloadUrl,
              updateTime: $updateTime,
              storeName: $storeName
          });
      });
      console.log('inside func ' + JSON.stringify(data));
      return data;
    })
};

paginate = ($, url) => {
      let pages = [];

      $('tfoot tr.webgrid-footer td a').each(function(){
          let text = $(this).text();
          let href = $(this).attr("href");
          if(text != null && text === ">"){
              pages.push(url + href);
          // } else if (!pages.length) {
          //     return null;
          }
      });
      //return the next page to scape
      return pages;
};

module.exports.urlsScraper = urlsScraper;

// http://prices.shufersal.co.il/FileObject/UpdateCategory?catID=2&storeId=0&page=3&__swhg=1515933669921

// <tr class="webgrid-row-style">
//             <td><a href="http://pricesprodpublic.blob.core.windows.net/price/Price7290027600007-001-201801101430.gz?sv=2014-02-14&amp;sr=b&amp;sig=YHrvJXOl6nXr1cR5qtUDMCUTKg46WstHToegiStodo4%3D&amp;se=2018-01-10T14%3A05%3A42Z&amp;sp=r" target="_blank">לחץ להורדה</a></td>
//             <td>1/10/2018 2:30:00 PM</td>
//             <td>664 B</td>
//             <td>GZ</td>
//             <td>price</td>
//             <td>1 - שלי ת&quot;א- בן יהודה</td>
//             <td>Price7290027600007-001-201801101430</td>
//             <td>1</td>
//         </tr>
