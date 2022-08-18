const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
    title:{type:String, required:true},
    price:{type:Number, required:true},
    details:String,
    image:String,
    quantity:{type:Number,required:true},
    stars:Number


})

module.exports = mongoose.model("Item", ItemSchema)