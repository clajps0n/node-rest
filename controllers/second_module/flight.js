//modelo
var Flight = require("../../models/flight");

function selectFlight(req,res)
{
  var flightId = req.params.flightId;
  Flight.findById(flightId,
  function(err, flight)
  {
    if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
    if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
    res.status(200).send({flight});
  });
}

function selectFlightByFlightNumber(req,res)
{
  var flightNumber = req.params.flightNumber;
  Flight.findOne({flightNumber},'_id flightNumber',
  function(err, flight)
  {
    if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
    if(!flight) return res.status(404).send({status:404,message:`El vuelo requerido no se encuentra en db: ${flight}`});
    res.status(200).send({status:200,flight});
  });
}

function selectFlights(req,res)
{
  Flight.find({},
  function(err, flights)
  {
    if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
    if(!flights) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flights}`});
    res.status(200).send({flights});
  });
}

function selectCurrentFlights(req,res)
{
  Flight.find({hidden:false},
  function(err, flights)
  {
    if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
    if(!flights) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flights}`});
    res.status(200).send({flights});
  });
}



function insertFlight(req,res)
{
  var flight = new Flight();
  flight.flightNumber = req.body.flightNumber;
  flight.origin = req.body.origin;
  flight.destination = req.body.destination;
  flight.aircraftNumber = req.body.aircraftNumber;
  flight.save((err, flightDoc) =>
  {
    if(err) res.status(500).send({message: `Error al guardar en db: ${err}`});
    res.status(200).send({flightInserted : flightDoc});
  });
}

function updateFlight(req,res)
{
  var flightId = req.params.flightId;
  var dataForUpdate = req.body;
  Flight.findByIdAndUpdate(flightId, dataForUpdate,
  function(err, flight)
  {
    if(err) return res.status(500).send({message:`Error al actualizar recurso de la db: ${err}`});
    if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
    res.status(200).send({message:'El vuelo ha sido actualizado correctamente.'});
  });
}

function addOOOIReport(req,res)
{
  var flightId = req.params.flightId;
  var dataForAdd = req.body;
  console.log(dataForAdd);
  Flight.findByIdAndUpdate(flightId,{$push:{'oooiReportHistory':dataForAdd}},{safe: true, upsert: true, new : true},
            function(err, model)
            {
              if(err) console.log(err);
              res.status(200).send({message:'El reporte ha sido añadido correctamente.',model:model});
            });
}


function addPOSReport(req,res)
{
  var flightId = req.params.flightId;
  console.log(req.body);
  Flight.findByIdAndUpdate(flightId,
    {$push:{'posReportHistory':req.body}},
    {safe: true, upsert: true, new : true},
    function(err, model)
    {
      if(err) console.log(err);
      res.status(200).send({message:'El reporte ha sido añadido correctamente.',model:model});
    });
}

function deleteFlight(req,res)
{
  var flightId = req.params.flightId;
  Flight.findById(flightId,
  function(err, flight)
  {
    if(err) return res.status(500).send({message:`Error al remover recurso de la db: ${err}`});
    if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
    Flight.remove(flight,err =>
      {
        if(err) return res.status(500).send({message:`Error al remover recurso de la db: ${err}`});
        res.status(200).send({message:'El vuelo ha sido removido correctamente.'});
      });
  });
}


function getGeoJSON(req,res)
        {
          Flight.find({},
          function(err, flights)
          {
            if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
            if(!flights) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flights}`});
            
            var gFlights = 
            {
                type: "FeatureCollection",
                features : []
            };
            
            for(var i in flights)
            {
                //console.log('air number: '+flights[i].aircraftNumber);
                var coords = [];
                var flight = flights[i];
                for(var j=0; j<flight.posReportHistory.length; j++) 
                {
                  //{"lat":flight.posReportHistory[j].lat, "lng":flight.posReportHistory[j].lon}
                    var pos = [parseFloat(flight.posReportHistory[j].lon),parseFloat(flight.posReportHistory[j].lat)];
                    //var pos = [128.84,-25.76];
                    coords.push(pos);
                }
                gFlights.features.push(
                    {
                        type: "Feature",
                        properties:
                        {
                            flightNumber : flights[i].flightNumber,
                            aircraftNumber : flights[i].aircraftNumber
                        },
                        geometry : 
                        {
                            type : "LineString",
                            coordinates : coords
                        }
                    }
                    );
            }
            
            res.status(200).send(gFlights);
          });
        }
        
function getLastPosGeoJSON(req,res)
        {
          Flight.find({},
          function(err, flights)
          {
            if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
            if(!flights) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flights}`});
            
            var gFlights = 
            {
                type: "FeatureCollection",
                features : []
            };
            
            for(var i in flights)
            {
                //console.log('air number: '+flights[i].aircraftNumber);
                
                var flight = flights[i];
                
                if(flight.hidden == false)
                {
                  var cont = flight.posReportHistory.length;
                  var coords = [flight.posReportHistory[cont-1].lon,flight.posReportHistory[cont-1].lat];
                  //var pos = [128.84,-25.76];
                  
                  
                  gFlights.features.push(
                    {
                      type: "Feature",
                      properties:
                      {
                          "title" : '<h1><a id="details-ref" class="ui-btn ui-btn-inline ui-corner-all ui-shadow">'+flights[i].flightNumber+'</a></h1>',
                          "description" : flights[i].aircraftNumber,
                          "marker-color": "#2E2EFE",
                          "marker-size": "medium",
                          "marker-symbol": "airport"
                      },
                      geometry : 
                      {
                          type : "Point",
                          coordinates : coords
                      }
                    });
                }
                
            }
            
            res.status(200).send(gFlights);
          });
        }
        
        
function getFlightGeoJSON(req,res)
        {
          Flight.findOne({flightNumber : req.params.flightNumber},
          function(err, flight)
          {
            if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
            if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
            
            var gFlight = 
            {
                type: "FeatureCollection",
                features : []
            };
            
            var points = [];
            
            for(var i = 0; i < flight.posReportHistory.length; i++)
            {
              var coords = [flight.posReportHistory[i].lon,flight.posReportHistory[i].lat];
              points.push(coords);
            }

            gFlight.features.push(
              {
                type: "Feature",
                properties:
                {
                  "stroke": "#0b9f1e",
                  "stroke-width": 3,
                  "stroke-opacity": 1,
                  "fill": "#555555"
                },
                geometry : 
                {
                    type : "LineString",
                    coordinates : points
                }
              });
            res.status(200).send(gFlight); 
          });
          
          
        }

module.exports = {
    selectFlight,
    selectFlights,
    selectCurrentFlights,
    insertFlight,
    updateFlight,
    addOOOIReport,
    addPOSReport,
    deleteFlight,
    selectFlightByFlightNumber,
    getGeoJSON,
    getLastPosGeoJSON,
    getFlightGeoJSON
}