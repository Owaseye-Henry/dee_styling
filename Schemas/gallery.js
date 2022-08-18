const mongoose = require("mongoose")

const GallerySchema = new mongoose.Schema({
    title:String,
    message:String,
    image:String,


})

module.exports = mongoose.model("gallery_image", GallerySchema)