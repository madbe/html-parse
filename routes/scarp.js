const request = require('request');
const cheerio = require('cheerio');

urlScraper = (baseUrl) => {

    let $url = baseUrl;
    let results = [];

    //get the last page number
    getLastPageNumber($url)
        .then((lastPage) => {

            //get all the site pages
            getPagesUrl($url, 5)
                .then((pages) => {
                    console.log('data from scraper received ');
                    results = results.concat(pages);
                    console.log(results);
                })
                .catch((error) => {
                    console.log('error scraping data');
                });

        })
        .catch((error) => {
            console.log('page number unknown');
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
