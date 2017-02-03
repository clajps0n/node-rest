var cheerio = require("cheerio");
var request = require("request");
var URL = require("url-parse");
var scraper = require("scraperjs");
var Flight = require("../../models/flight");
var Airport = require("../../models/airport");


function getAccarsMessage(req,res)
{
    console.log(req.body);
    
    res.send(splitACCARS(req.body.variable));
}

function splitACCARS(accars)
{
    var firstPart;
    if(accars.length >= 126)
    {
        if(accars.includes(" - "))
        {
            
            firstPart = accars.split(" - ");
            if(firstPart[1].includes("WXRQ") || firstPart[1].includes("OUTRP") || firstPart[1].includes("OFFRP") || firstPart[1].includes("ONRP") || firstPart[1].includes("INRP") || firstPart[1].includes("POSRPT"))
            {
                return firstPart[1];
            }else
            {
                return 0;
            }
        }else
        {
            return 0;
        }
    }else
    {
        return 0;
    }
}


function savePosition(req,res)
{
    var accars = req.body.message;
    var body = splitACCARS(accars);
    if(body != 0)
    {
        if(body.includes("POSRPT"))
        {
            var posArr = getPosArray(body);
            var posRep = posArr.data;
            var flight = posArr.flight;
            console.log(flight);
            Flight.findOne({flightNumber:flight},'_id',
            function(err, flight)
            {
                if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
                if(!flight) return res.status(404).send({status:404,message:`El vuelo requerido no se encuentra en db: ${flight}`});
                Flight.findByIdAndUpdate(flight._id,
                {$push:{'posReportHistory':posRep}},
                {safe: true, upsert: true, new : true},
                function(err, model)
                {
                  if(err) console.log(err);
                  res.status(200).send({message:'El reporte ha sido añadido correctamente.',model:model});
                });
            });
        }
    }else
    {
        res.send("La solicitud no corresponde a un formato correcto. Verifique su mensaje.")
    }
}

function responseACCARS(req,res)
{
    var accars = req.body.message;
    var body = splitACCARS(accars);
    if(body != 0)
    {
        if(body.includes("OUTRP"))
        {
            var outArr = getOutOnArray(body);
            var flight = outArr.flight;
            var origin = outArr.origin;
            var destination = outArr.destination;
            var aircraft = outArr.aircraftNumber;
            var outRep = outArr.data;
            
            Airport.findOne({acronym:origin},'coords',
            function(err, airport)
            {
                if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
                if(!airport) return res.status(404).send({status:404,message:`El aeropuerto requerido no se encuentra en db: ${flight}`});
                var posReport =
                {
                    lat : airport.coords[1],
                    lon : airport.coords[0],
                    altitude : 0
                };
                var newFlight = 
                {
                    flightNumber : flight,
                    origin : origin,
                    destination : destination,
                    aircraftNumber : aircraft,
                    posReportHistory : posReport,
                    oooiReportHistory : outRep
                };
                var nFlight = new Flight(newFlight);
                nFlight.save(function(err, flight)
                {
                    console.log(flight);
                    if(err) res.status(500).send({message: `Error al guardar en db: ${err}`});
                    res.status(200).send({message : "Un nuevo vuelo ha sido registrado en la base de datos. Datos guardados correctamente."});
                });
            });
        }else
        if(body.includes("OFFRP"))
        {
            var arrOff = getOffInArray(body);
            var flightN = arrOff.flight;
            var offRep = arrOff.data;
            Flight.findOne({flightNumber : flightN},'_id',
            function(err, flight)
            {
                if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
                if(!flight) return res.status(404).send({status:404,message:`El vuelo requerido no se encuentra en db: ${flight}`});
                var fId = flight._id;
                Flight.findByIdAndUpdate(fId, {$push:{'oooiReportHistory':offRep}},{safe: true, upsert: true, new : true},
                function(err, flight)
                {
                    if(err) return res.status(500).send({message:`Error al actualizar offReport de la db: ${err}`});
                    if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
                    res.status(200).send({message:'El reporte ha sido añadido, el vuelo ha sido actualizado correctamente.'});
                });
            });
        }else
        if(body.includes("ONRP"))
        {
            var arrOn = getOutOnArray(body);
            var flightN = arrOn.flight;
            var onRep = arrOn.data;
            Flight.findOne({flightNumber : flightN},'_id',
            function(err, flight)
            {
                if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
                if(!flight) return res.status(404).send({status:404,message:`El vuelo requerido no se encuentra en db: ${flight}`});
                var fId = flight._id;
                Flight.findByIdAndUpdate(fId, {$push:{'oooiReportHistory':onRep}},{safe: true, upsert: true, new : true},
                function(err, flight)
                {
                    if(err) return res.status(500).send({message:`Error al actualizar offReport de la db: ${err}`});
                    if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
                    res.status(200).send({message:'El reporte ha sido añadido, el vuelo ha sido actualizado correctamente.'});
                });
            });
        }else
        if(body.includes("INRP"))
        {
            var arrIn = getOffInArray(body);
            var flightN = arrIn.flight;
            var inRep = arrIn.data;
            Flight.findOne({flightNumber : flightN},'_id',
            function(err, flight)
            {
                if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
                if(!flight) return res.status(404).send({status:404,message:`El vuelo requerido no se encuentra en db: ${flight}`});
                var fId = flight._id;
                Flight.findByIdAndUpdate(fId,{$push:{'oooiReportHistory':inRep},hidden:true},{safe: true, upsert: true, new : true},
                function(err, flight)
                {
                    if(err) return res.status(500).send({message:`Error al actualizar offReport de la db: ${err}`});
                    if(!flight) return res.status(404).send({message:`El vuelo requerido no se encuentra en db: ${flight}`});
                    res.status(200).send({message:'El reporte ha sido añadido, el vuelo ha sido actualizado correctamente.'});
                });
            });
        }else
        if(body.includes("POSRPT"))
        {
            var posArr = getPosArray(body);
            var posRep = posArr.data;
            var flightN = posArr.flight;
            Flight.findOne({flightNumber:flightN},'_id',
            function(err, flight)
            {
                if(err) return res.status(500).send({status:500,message:`Error al pedir recurso de la db: ${err}`});
                if(!flight) return res.status(404).send({status:404,message:`El vuelo requerido no se encuentra en db: ${flight}`});
                Flight.findByIdAndUpdate(flight._id,
                {$push:{'posReportHistory':posRep}},
                {safe: true, upsert: true, new : true},
                function(err, model)
                {
                  if(err) console.log(err);
                  res.status(200).send({message:'El reporte ha sido añadido correctamente.',model:model});
                });
            });
        }if(body.includes("WXRQ"))
        {
            var arrM = body.split("/");
            var cities = [];
            for(var i = 0; i<arrM.length; i++)
            {
                if(arrM[i].includes("STA"))
                {
                    var c = arrM[i].split(" ");
                    cities.push(c[1]);
                }
            }
            console.log(cities);
            var page = setURL(cities);
           
            scraper.StaticScraper.create(page).scrape(
            function($) 
            {
                var arrMetar = $("font").map(
                function() 
                {
                    return $(this).text();
                }).get();
                res.send({type:'metar', message:arrMetar});
            });
        }
    }else
    {
        res.send({message:"La solicitud no corresponde a un formato correcto. Verifique su mensaje."});
    }
}

function getOffInArray(accarsBody)
{
    var arrOffIn = accarsBody.split("/");
    var flight = arrOffIn[0].split(" ")[2];
    var type = arrOffIn[0].split(" ")[1];
    var utc =   arrOffIn[4].split(" ")[1];
    var fuel =  arrOffIn[5].split(" ")[1];
    
    var offInReport = 
    {
        flight : flight,
        data : 
        {
            reportType : type,
            UTCtime : utc,
            fuel : fuel
        }
    }
    return offInReport;
}


function getPosArray(accarsBody)
{
    var arrP = accarsBody.split("/");
    var flight = arrP[0].split(" ")[2];
    var utc =   arrP[3].split(" ")[1];
    var pos =   arrP[4].split(" ")[1];
    var alt =   arrP[5].split(" ")[1];
    var speed = arrP[6].split(" ")[1];
    var fuel =  arrP[7].split(" ")[1];
    
    var latlon = formatCoords(pos);
    
    var lat = latlon[0];
    var lon = latlon[1];
    
    var posReport = 
    {
        flight : flight,
        data : 
        {
            lat : lat,
            lon : lon,
            UTCtime : utc,
            speed : speed,
            altitude : alt,
            fuel : fuel
        }
    }
    return posReport;
}

function getOutOnArray(accarsBody)
{
    var arrOut = accarsBody.split("/");
    var flight = arrOut[0].split(" ")[2];
    var type = arrOut[0].split(" ")[1];
    var origin = arrOut[1].trim();
    var destination = arrOut[2].split(" ")[0];
    var aircraft = arrOut[2].split(" ")[1];
    var utc =   arrOut[3].split(" ")[1];
    var fuel =  arrOut[4].split(" ")[1];
    
    var outReport = 
    {
        flight : flight,
        aircraftNumber : aircraft,
        origin : origin,
        destination : destination,
        data : 
        {
            reportType : type,
            UTCtime : utc,
            fuel : fuel
        }
    }
    return outReport;
}


function formatCoords(pos)
{
    //sddmmtsdddmmt
    var dirLat = pos.substr(0,1);
    var dLat = pos.substr(1,2);
    var mLat = pos.substr(3,2);
    var sLat = pos.substr(5,1);
    var dirLon = pos.substr(6,1);
    var dLon = pos.substr(7,3);
    var mLon = pos.substr(10,2);
    var sLon = pos.substr(12,1);
    //$lat = $dms['d'] + ($dms['m']/60) + ($dms['s']*6/3600);
    var lat = parseFloat(dLat) + parseFloat(mLat)/60 + parseFloat(sLat)*6/3600;
    var lon = parseFloat(dLon) + parseFloat(mLon)/60 + parseFloat(sLon)*6/3600;
    if(dirLat == "S")
    {
        lat = -1 * lat;
    }else
    if(dirLon == "W")
    {
        lon = -1 * lon;
    }
    return [lat,lon];
}

function responseMetar(req, res)
{
    var firstPart;
    var accars = req.body.message;
    var from = req.body.aircraft;
    var body = splitACCARS(accars);
    if(body != 0)
    {
        if(body.includes("WXRQ"))
        {
            var arrM = body.split("/");
            var cities = [];
            for(var i = 0; i<arrM.length; i++)
            {
                if(arrM[i].includes("STA"))
                {
                    var c = arrM[i].split(" ");
                    cities.push(c[1]);
                }
            }
            console.log(cities);
            var page = setURL(cities);
           
            scraper.StaticScraper.create(page).scrape(
            function($) 
            {
                var arrMetar = $("font").map(
                function() 
                {
                    return $(this).text();
                }).get();
                res.send({to:from, type:'metar', message:arrMetar});
            });
        }else
        {
            res.send("La solicitud no corresponde a un formato correcto. Verifique su mensaje.")
        }
    }else
    {
        res.send("Mensaje no válido");
    }
}

function setURL(cities)
{
    var pre = 'http://www.aviationweather.gov/adds/metars/?station_ids=';
    var pos = '&std_trans=standard&chk_metars=on&hoursStr=most%20recent%20only&submitmet=Submit';
    for(var i in cities)
    {
        pre = pre + cities[i] + ',';
    }
    var url = pre + pos;
    return url;
}

module.exports =
    {
        getAccarsMessage,
        responseMetar,
        savePosition,
        responseACCARS
    };