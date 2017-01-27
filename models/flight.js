var mongoose = require("mongoose");
var Schema = mongoose.Schema;

    var flight = Schema(
    {
        flightNumber:   {type:String,unique:true},
        origin:         String,
        destination:    String,
        aircraftNumber: String,
        date:           {type:Date, default:Date.now()},
        hidden:         {type:Boolean, default:false},
        oooiReportHistory:
        [{
            reportType:     String,
            UTCtime:        String,
            fuel:           String
        }],
        posReportHistory: 
        [{
            lat:        Number,
            lon:        Number,
            UTCtime:    String,
            altitude:   String,
            speed:      String,
            fuel:       Number,
            dateRep:    {type:Date, default:Date.now()}
        }]
    });
    
    
module.exports = mongoose.model('Flight',flight);
