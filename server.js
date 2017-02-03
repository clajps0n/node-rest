'use strict'

var http = require('http');

var async = require('async');

var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

//modelo
var Flight = require("./models/flight");
var Airport = require("./models/airport")


var router = require("./router");


var server = http.createServer(router);


//bd url: mongodb://<dbuser>:<dbpassword>@ds161518.mlab.com:61518/node-rest-db

mongoose.connect('mongodb://cristian:cristianPw@ds161518.mlab.com:61518/node-rest-db',
      function(err, res)
      {
        if(err) console.log(err);
        console.log("conexion establecida!");
        
        server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
        function(){
          var addr = server.address();
          console.log("Flights server listening at", addr.address + ":" + addr.port);
        });
      });



