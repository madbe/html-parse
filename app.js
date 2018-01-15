var express = require('express')
var $ = require('cheerio')
var request = require('request')
// var pictureTube = require('picture-tube')
var app = express()
var imageURLs = []

function gotHTML(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)
  // get all img tags and loop over them

  parsedHTML('a').map(function(i, link) {
    var href = $(link).attr('href')
    if (!href.match('.png')) return
    imageURLs.push(domain + href)


  })

console.log(imageURLs)
// var randomIndex = Math.floor(Math.random() * imageURLs.length)
// var randomImage = imageURLs[randomIndex]
// request(randomImage).pipe(pictureTube()).pipe(process.stdout)
}

var domain = 'http://substack.net/images/'
request(domain, gotHTML)



app.listen('8081', function(){
  console.log('Magic happens on port 8081');
})
