const express = require("express")
const router = express.Router()
const formidable = require("express-formidable")
const path = require("path")
const fs = require("fs")

const Item = require("../Schemas/item")
const Order = require("../Schemas/orders")

// get all parginated
router.get("/all-parginated",async(req,res)=>{
    try {
        const all = await Item.find({})
        let page = req.query.page
        const limit = 5
        if(! req.query.page) page = 1

        const total_pages = Math.ceil(all.length / limit)
        let previous_page_number, next_page_number;

        if(page > 1) previous_page_number = parseInt(page) - 1
        else previous_page_number = null

        if(page < total_pages ) next_page_number = parseInt(page) + 1
        else next_page_number = null


        
        let startIndex = (page - 1) * limit
        let endIndex = page * limit

        const items = all.slice(startIndex,endIndex)
    
        const data = {items, previous_page_number,next_page_number, page: parseInt(page),total_pages : parseInt(total_pages)}

       
        res.json(data)
//   PAGINATE
    } catch (error) {
        console.log("get all error"+ error)  
    }
})
// get all 

router.get("/all",async(req,res)=>{
    try{
        const all = await Item.find({})
        res.json(all)
    }catch(error){
        console.log("get all error " + error)
    }
})

//get one
router.get("/:id",async(req,res)=>{
    try {
        const one = await Item.findById(req.params.id)
        res.json(one)
    } catch (error) {
        console.log("get one error"+ error)
    }
})

// add one
router.post("/add",formidable(),async(req,res)=>{
    try {
        let image = ""
        const {title,price,details,quantity,stars} = req.fields
        const oldpath = req.files.image.path
        const newpath = path.resolve(__dirname,'..//public/media/'+ req.files.image.name)

        if(!fs.existsSync(newpath)){
            image = "/media/"+ req.files.image.name
            const data = fs.readFileSync(oldpath)
                fs.writeFileSync(newpath,data)
        }
        newItem = new Item({title,price,details,image,quantity,stars})
        newItem.save()
        console.log(newItem)
        res.json(newItem)
    } catch (error) {
        console.log("add item error: " + error)
    }
})

//edit one
router.put("/edit/:id",formidable(),async(req,res)=>{
    try {
        const one = await Item.findById(req.params.id) 
        const {title,price,details,quantity,stars} = req.fields
        let image;
        const oldimage = one.image
         if (oldimage == "" || oldimage =='')
            image = ""
         else 
            image = oldimage
            
        const oldimagepath = path.resolve(__dirname,'..//public/'+ oldimage)

        if(req.files.image.name){
             image = "/media/"+ req.files.image.name
            if(oldimage != null && oldimage != undefined && oldimage !="" ){
                if(fs.existsSync(oldimagepath)){
                    fs.unlinkSync(oldimagepath)
                }
            }

            const oldpath = req.files.image.path
            const newpath = path.resolve(__dirname,'..//public/media/'+ req.files.image.name)
            if(!fs.existsSync(newpath)){
                const data = fs.readFileSync(oldpath)
                fs.writeFileSync(newpath,data)
            }

        }

        one.title = title
        one.price = price,
        one.details = details
        one.quantity = quantity
        one.stars = stars
        one.image = image
        one.save()
        console.log(one)
    } catch (error) {
        console.log("edit error: "+ error)
    }
})

//deleteone
router.delete("/delete/:id",async(req,res)=>{
    try {
        const one = Item.findById(req.params.id)
         if(one.image){
            if(one.image != ""){
                const removepath = path.resolve(__dirname,'..//public/'+ one.image)
                fs.unlinkSync(removepath)
            }
            
        }

        await one.remove()
        
    } catch (error) {
        console.log("delete error: " + error)
    }
})




module.exports = router