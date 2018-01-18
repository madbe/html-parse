const request = require('request');
const cheerio = require('cheerio');

urlScraper = (baseUrl) => {

    let $url = baseUrl;

    //get the last page number
    getLastPageNumber($url)
        .then((lastPage) => {
            //get all the site pages for short test I set the lastPage to 5
            getPagesUrl($url, 5)
                .then((pages) => {
                    console.log('data from scraper received ');
                    console.log(pages);
                    dataScraper(pages)
                        .then((data) =>  {
                            console.log('data from pages received ');
                            console.log(data);
                    })
                        .catch((error)=>{
                            console.log(error);
                        });

                })
                .catch((error) => {
                    console.log('error scraping data');
                });

        })
        .catch((error) => {
            console.log('error getting last page');
        });





};

/*
Scrap the data from the pages and return them as array of json object
that contain the: gz url download link, time of update and store name
in the network.
 */
dataScraper = (pagesUrl) => {
    if (!pagesUrl.length) { return; }

    let data = [];
    let lastPage = pagesUrl.length;
    return new Promise((resolve, reject) => {
        for(let pageUrl in pagesUrl) {
            // Setting URL and headers for request
            let options = {
                url: pagesUrl[pageUrl],
                headers: {
                    'User-Agent': 'request'
                }
            };
            request(options, (error, resp, body) => {

                if(!error && resp.statusCode === 200){
                    let $ = cheerio.load(body);

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

                    if(!--lastPage){
                        // console.log('inside func ' + JSON.stringify(data));
                        resolve(data);
                    }

                } else {
                    console.log(error);
                    reject(error)
                }
            })
        }
    });
};

getPagesUrl = (url, lastPage) => {

    let baseUrl = url.substring(0, 29); // baseUrl/?page=1....64
    let pages = [];
    pages.push(url);
    return new Promise((resolve, reject) => {

        //call recursion function 1st.
        getPage(url, lastPage);

        //need this extra fn due to recursion
        function getPage(pageUrl, lastPageNumber) {
            // Setting URL and headers for request
            let options = {
                url: pageUrl,
                headers: {
                    'User-Agent': 'request'
                }
            };

            request.get(options, (error, resp, body) => {
                if (!error && resp.statusCode === 200) {
                    let $ = cheerio.load(body);
                    let page;

                    $('tfoot tr.webgrid-footer td a').each(function () {
                        let text = $(this).text();
                        let href = $(this).attr("href");

                        if (text != null && text === ">") {
                            // console.log(href);
                            page = (baseUrl + href);
                            pages.push(page);
                            let currentPage = pageNumber(href);

                            if (currentPage < lastPageNumber) {
                                getPage(page, lastPageNumber); //recursion
                            } else {
                                // console.log('end of loop');
                                //return the next page to scape
                                resolve(pages);
                            }
                        }
                    });

                }else {
                    reject(error);
                }
            });
        }

    })
};

getLastPageNumber = (url) => {
    // Setting URL and headers for request
    let options = {
        url: url,
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise((resolve, reject) => {
        request.get(options, (error, resp, body) => {
            if (!error && resp.statusCode === 200) {
                let $ = cheerio.load(body);
                $('tfoot tr.webgrid-footer td a').each(function () {
                    let text = $(this).text();
                    let href = $(this).attr("href");
                    if (text != null && text === ">>") {
                        resolve(pageNumber(href));
                    }
                });
            } else {
                reject(error);
            }
        });
    });
};

pageNumber = (pageHref) => {
    let len = pageHref.length;
    let lastNumber = pageHref.substring(7, len);
    return (parseInt(lastNumber));
};

module.exports.urlScraper = urlScraper;


get_all_pages = function (callback, page) {
    page = page || 1;
    request.get({
        url: "http://example.com/getPage.php",
        data: {page_number: 1},
        success: function (data) {
            if (data.is_last_page) {
                // We are at the end so we call the callback
                callback(page);
            } else {
                // We are not at the end so we recurse
                get_all_pages(callback, page + 1);
            }
        }
    })
};

function show_page_count(data) {
    alert(data);
}

get_all_pages(show_page_count);
