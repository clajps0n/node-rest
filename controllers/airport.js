//modelo
var Airport = require("../models/airport");

function selectAirport(req,res)
{
  var airportId = req.params.airportId;
  Airport.findById(airportId,
  function(err, airport)
  {
    if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
    if(!airport) return res.status(404).send({message:`El aeropuerto requerido no se encuentra en db: ${airport}`});
    res.status(200).send({airport});
  });
}

function selectAirportByAirportAcronym(req,res)
{
  var airportAcronym = req.params.acronym;
  console.log(airportAcronym);
  Airport.findOne({acronym : airportAcronym},
  function(err, airport)
  {
    if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
    if(!airport) return res.status(404).send({status:404,message:`El aeropuerto requerido no se encuentra en db: ${airport}`});
    res.status(200).send({status:200,airport});
  });
}

function selectAirportPosByAirportAcronym(req,res)
{
  var airportAcronym = req.params.acronym;
  console.log(airportAcronym);
  Airport.findOne({acronym : airportAcronym},'coords',
  function(err, airport)
  {
    if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
    if(!airport) return res.status(404).send({status:404,message:`El aeropuerto requerido no se encuentra en db: ${airport}`});
    res.status(200).send(airport);
  });
}

function selectAirports(req,res)
{
  Airport.find({},
  function(err, airports)
  {
    if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
    if(!airports) return res.status(404).send({message:`El aeropuerto requerido no se encuentra en db: ${airports}`});
    res.status(200).send({airports});
  });
}



function insertAirport(req,res)
{
  console.log(req.body);
  var airport = new Airport();
  
  //airport = req.body;
  airport.acronym = req.body.acronym;
  airport.name = req.body.name;
  airport.state = req.body.state,
  airport.coords = req.body.coords;
  
  airport.save((err, airportDoc) =>
  {
    if(err) res.status(500).send({message: `Error al guardar en db: ${err}`});
    res.status(200).send({airportInserted : airportDoc});
  });
}

function updateAirport(req,res)
{
  var airportId = req.params.airportId;
  var dataForUpdate = req.body;
  Airport.findByIdAndUpdate(airportId, dataForUpdate,
  function(err, airport)
  {
    if(err) return res.status(500).send({message:`Error al actualizar recurso de la db: ${err}`});
    if(!airport) return res.status(404).send({message:`El aeropuerto requerido no se encuentra en db: ${airport}`});
    res.status(200).send({message:'El aeropuerto ha sido actualizado correctamente.'});
  });
}


function deleteAirport(req,res)
{
  var airportId = req.params.airportId;
  Airport.findById(airportId,
  function(err, airport)
  {
    if(err) return res.status(500).send({message:`Error al remover recurso de la db: ${err}`});
    if(!airport) return res.status(404).send({message:`El aeropuerto requerido no se encuentra en db: ${airport}`});
    Airport.remove(airport,err =>
      {
        if(err) return res.status(500).send({message:`Error al remover recurso de la db: ${err}`});
        res.status(200).send({message:'El aeropuerto ha sido removido correctamente.'});
      });
  });
}

function getAirportsGeoJSON(req,res)
{
    Airport.find({},
    function(err, airports)
    {
    if(err) return res.status(500).send({message:`Error al pedir recurso de la db: ${err}`});
    if(!airports) return res.status(404).send({message:`El aeropuerto requerido no se encuentra en db: ${airports}`});
    var gAirports = 
            {
                type: "FeatureCollection",
                features : []
            };
    var features = [];
    for(var i in airports)
    {
        features.push(
        {
          type: "Feature",
          properties:
          {
            "title": airports[i].acronym,
            "description": airports[i].name,
            "marker-color": "#fc4353",
            "marker-size": "medium",
            "marker-symbol": "monument"
          },
          geometry : 
          {
              type : "Point",
              coordinates : airports[i].coords
          }
        });
    }
    
    gAirports.features = features;
    res.status(200).send(gAirports);
    });
}


module.exports = {
    selectAirport,
    selectAirports,
    insertAirport,
    updateAirport,
    deleteAirport,
    selectAirportByAirportAcronym,
    selectAirportPosByAirportAcronym,
    getAirportsGeoJSON
}