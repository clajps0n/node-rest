var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var airport = new Schema(
        {
            acronym :   {type:String, unique:true},
            name:       String,
            state:String, 
            coords: [Number,Number]
        });
        
module.exports = mongoose.model('Airport',airport);