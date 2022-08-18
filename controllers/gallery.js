const express = require('express')
const router = express.Router()
const formidable = require('express-formidable')
const fs = require("fs")
const path = require("path")

const Gallery_image = require('../Schemas/gallery')

// get all
router.get("/",async (req,res)=>{
    try{
        console.log("linking")
        const all = await Gallery_image.find({})
        res.json(all)
        console.log(all)
        
    }
    catch(error){
          console.log(error)
    }
})


// get one
router.get("/:id",async (req,res)=>{
    try{
        const one = await Gallery_image.findById(req.params.id)
        res.json(one)

    }
    catch(error){
        console.log(error)
    }
})

//  create one
router.post("/",formidable(),async (req,res)=>{
    try{
        const date = new Date().getMinutes().toString() + new Date().getMilliseconds().toString()
        let image = ""
        const {title,message} = req.fields
        const oldpath = req.files.image.path
        const newpath = path.resolve(__dirname,'..//public/media/'+ date + req.files.image.name )

        if(!fs.existsSync(newpath)){
            image = "/media/" + date + req.files.image.name
            const data = fs.readFileSync(oldpath)
                fs.writeFileSync(newpath,data)
        }
        newImage = new Gallery_image({title,message,image})
        newImage.save()
        console.log(newImage)
        res.json("successfully added image to gallery")
    
    }
    catch(error){
        console.log(error)
    }
})

//edit one
router.put("/:id", formidable(), async (req,res)=>{
    try{
        const one = await Gallery_image.findById(req.params.id) 
        const {title,message} = req.fields
        let image=""
        const date = new Date().getHours()+ new Date().getSeconds().toString()
        const oldimage = one.image
        const oldimagepath = path.resolve(__dirname,'..//public/'+ oldimage)

        if(req.files.image.name){
            image = "/media/"+date+req.files.image.name
            if(oldimage != null && oldimage != undefined && oldimage !="" ){
                if(fs.existsSync(oldimagepath)){
                    fs.unlinkSync(oldimagepath)
                }
            }

            const oldpath = req.files.image.path
            const newpath = path.resolve(__dirname,'..//public/media/'+date+req.files.image.name)
            if(!fs.existsSync(newpath)){
                const data = fs.readFileSync(oldpath)
                fs.writeFileSync(newpath,data)
            }

        }

        one.title = title
        one.message = message
        one.image = image

        one.save()

        console.log(one)

        res.json("Updated successfully") // redirect back to admin panel
    }
    catch(error){
        console.log(error)
    }
})


//delete one
router.delete("/:id",async (req,res)=>{
    try{
        const one = Gallery_image.findById(req.params.id)
        if(one.image){
           if(one.image != ""){
               const removepath = path.resolve(__dirname,'..//public/'+ one.image)
               fs.unlinkSync(removepath)
           }
           
       }

       await one.remove()

       res.json("succesfully deleted image")
    }
    catch(error){
        console.log(error)
    }
})



module.exports = router

