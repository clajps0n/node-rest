var cheerio = require("cheerio");
var request = require("request");
var URL = require("url-parse");
var scraper = require("scraperjs");
var jsdom = require("jsdom");

function getMeteorologicalPage(req,res)
{
    var page = 'http://200.21.18.93/obs_map';
    var page1 = 'http://200.21.18.93/wxwatch/loop?aoi=COL&channel=IR&list_id=1&product=TAF&loop_speed=4&obsCheck=1';
           
    jsdom.env(
      page,
      ["http://code.jquery.com/jquery.js"],
      function (err, window) {
        var $ = window.$;
        res.send($('.sortable').html());
      }
    );
    
}

function getWeatherImage(req,res)
{
  var url = 'http://200.21.18.93/satellite_image/latest?scroll_x=0&scroll_y=0&aoi=COL&channel=IR';
  jsdom.env(
      url,
      ["http://code.jquery.com/jquery.js"],
      function (err, window) 
      {
        var $ = window.$;
        var url = $('#stack div a').find('img').attr('src');
        res.send({url : url});
      }
    );
}

module.exports = 
{
    getMeteorologicalPage,
    getWeatherImage
}