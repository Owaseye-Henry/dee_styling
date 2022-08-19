const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    customer_name:String,
    customer_email:String,
    customer_address:String,
    customer_phone:Number,
    customer_comment:String,
    items:[{type:mongoose.Types.ObjectId, ref:"Item"}],
    quantity:[{type:Number}],
    total: Number,
    delivery_Status:Boolean,
    paid_cash:Boolean,
    date:String,
    transaction_id:String,
    tx_ref:String


})

module.exports = mongoose.model("order", OrderSchema)