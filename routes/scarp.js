const request = require('request');
const cheerio = require('cheerio');

let pages = [];

urlScraper = (baseUrl) => {

    let $url = baseUrl;
    // let pages = [];
    let pageUrl;
    let end = false;
    pages.push(baseUrl);
    //get the last page number
    getLastPageNumber($url)
        .then((lastPage) => {

            //get all the site pages
            getPageUrl($url, lastPage)
                .then((pages) => {
                    console.log('data from scraper received ' + page);

                    // pageUrl = pages;

                    console.log(pages);
                })
                .catch((error) => {
                    console.log('error scraping data');
                    end = true;
                });

        })
        .catch((error) => {
            console.log('page number unknown');
        });




};

getPageUrl = (url, lastPage) => {
    // Setting URL and headers for request
    let options = {
        url: url,
        headers: {
            'User-Agent': 'request'
        }
    };
    let page;
    let baseUrl = url.substring(0, 29); // baseUrl/?page=1....64
    //pages.push(url);
    return new Promise((resolve, reject) => {

        request.get(options, (error, resp, body) => {
            if (!error && resp.statusCode === 200) {
                let $ = cheerio.load(body);

                $('tfoot tr.webgrid-footer td a').each(function () {
                    let text = $(this).text();
                    let href = $(this).attr("href");

                    if (text != null && text === ">") {
                        console.log(href);
                        page = (baseUrl + href);
                        pages.push(page);
                        let currentPage = pageNumber(href);
                        if (currentPage < lastPage) {
                            getPageUrl(page, lastPage);
                        } else {
                            console.log('end of loop')
                            //return the next page to scape
                            resolve(pages);
                        }
                    }
                });

            } else {
                reject(error);
            }
        });
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
