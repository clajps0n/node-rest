'use strict'
//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
//var socketio = require('socket.io');
var express = require('express');

var bodyParser = require('body-parser');
var getJson = require('get-json');
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

//modelo
var Flight = require("./models/flight");
var Airport = require("./models/airport")
//controladores
var fController = require("./controllers/flight");
var aController = require("./controllers/airport");

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//router->app
var router = express();
var server = http.createServer(router);
//var io = socketio.listen(server);

router.use(bodyParser.urlencoded({ extended : false }));
router.use(bodyParser.json());
router.use(express.static(path.resolve(__dirname, 'client')));

//Urls for database management
router.get('/select/:flightId', fController.selectFlight);

router.get('/select', fController.selectFlights);

router.get('/selectbynumber/:flightNumber', fController.selectFlightByFlightNumber);

router.post('/insert', fController.insertFlight);

router.put('/update/:flightId', fController.updateFlight);

router.delete('/delete/:flightId', fController.deleteFlight);

router.put('/addoooi/:flightId', fController.addOOOIReport);

router.put('/addpos/:flightId', fController.addPOSReport);

//public geojson
router.get('/geojson', fController.getGeoJSON);

router.get('/lastposgeojson', fController.getLastPosGeoJSON);

router.get('/flightgeojson/:flightNumber', fController.getFlightGeoJSON);

//
router.get('/airport/:acronym', aController.selectAirportByAirportAcronym);

router.get('/airportpos/:acronym', aController.selectAirportPosByAirportAcronym);

router.get('/airports', aController.selectAirports);

router.post('/insertairport', aController.insertAirport);

router.get('/airportsgeojson', aController.getAirportsGeoJSON);

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



