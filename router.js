'use strict'

var express = require('express');

var bodyParser = require('body-parser');

var router = express();

var path = require('path');

router.use(bodyParser.urlencoded({ extended : false }));
router.use(bodyParser.json());
router.use(express.static(path.resolve(__dirname, 'client')));

//controladores
var rController = require("./controllers/first_module/report-decoder");
var fController = require("./controllers/second_module/flight");
var aController = require("./controllers/second_module/airport");
var mController = require("./controllers/first_module/metars");

//Urls for database management
router.get('/select/:flightId', fController.selectFlight);

router.get('/select', fController.selectFlights);

router.get('/currentflights', fController.selectCurrentFlights);

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

//methods for airports management
router.get('/airport/:acronym', aController.selectAirportByAirportAcronym);

router.get('/airportpos/:acronym', aController.selectAirportPosByAirportAcronym);

router.get('/airports', aController.selectAirports);

router.post('/insertairport', aController.insertAirport);

router.get('/airportsgeojson', aController.getAirportsGeoJSON);


//methods for messages management
router.post('/position', rController.savePosition);
router.post('/metar', rController.responseMetar);
router.post('/accars', rController.responseACCARS);

//
router.get('/colmetars', mController.getMeteorologicalPage);
router.get('/weather', mController.getWeatherImage);


module.exports = router;