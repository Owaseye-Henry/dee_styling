const express = require("express")
const router = express.Router()
const Gallery_image = require("../Schemas/gallery")
const Products = require("../Schemas/item")



function isAuth (req,res,next){
    if (req.session.user||req.session.admin){
        return next()
    }
    else {
        res.redirect('/')
    }
   }

function loggedout (req,res,next){
    if(!req.session.admin||!req.session.user) return next()
    else{
        res.redirect('/')
    }
}





router.get("/",async(req,res)=>{
    try {
        const images = await Gallery_image.find({})
         res.render("home",{images})
    } catch (error) {
        console.log(error)
    }
})

router.get("/shop",async(req,res)=>{
    try {
        res.render("shop")
    } catch (error) {
        console.log(error)
    }
})
router.get("/cart",async(req,res)=>{
    try {
        res.render("cart")
    } catch (error) {
        console.log(error)
    }
})
router.get("/product-details/:id",async(req,res)=>{
    try {
        const one = await Products.findById(req.params.id)
        res.render("product-details",{one})
    } catch (error) {
        console.log(error)
    }
})
router.get("/checkout",async(req,res)=>{
    try {
        res.render("checkout")
    } catch (error) {
        console.log(error)
    }
})

router.get("/admin",isAuth, async(req,res)=>{
    try{
        res.render("admin-page")
    } catch(error){
        console.log(error)
    }

})

router.get("/stock",isAuth, async(req,res)=>{
    try{
        res.render("stock")
    } catch(error){
        console.log(error)
    }

})
router.get("/pending-orders",isAuth,async(req,res)=>{
    try{
        res.render("pending-orders")
    } catch(error){
        console.log(error)
    }

})
router.get("/gallery", async(req,res)=>{
    try{
        res.render("gallery")
    } catch(error){
        console.log(error)
    }

})

router.get("/edit-gallery/:id",isAuth, async(req,res)=>{
    try{
        const one = await Gallery_image.findById(req.params.id)

        res.render("edit-gallery",{id:req.params.id, one})
    } catch(error){
        console.log(error)
    }

})
router.get("/edit-product/:id",isAuth, async(req,res)=>{
    try{
        const one = await Products.findById(req.params.id)
        res.render("edit-product",{one})
    } catch(error){
        console.log(error)
    }

})

router.get("/dashboard", async(req,res)=>{
    try{
        res.render("dashboard")
    } catch (error){
        console.log(error)
    }
})

router.get("/test",(req,res)=>{
    res.render("success", {message: "this thing dey work"})
})


module.exports = router