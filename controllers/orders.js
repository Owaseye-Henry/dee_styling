const express = require("express")
const router = express.Router()
const formidable = require("express-formidable")
const mongoose = require("mongoose")

const Item = require("../Schemas/item")
const Order = require("../Schemas/orders")


// get all
router.get("/",async(req,res)=>{
    try {
        const all_orders = await Order.find({}).populate("items")
        res.json(all_orders)
    } catch (error) {
        console.log(error)
    }
})

//get one

router.get("/:id",async(req,res)=>{
    try {
        const one = await Order.findById(req.params.id).populate("items")
        res.json(one)
    } catch (error) {
        console.log(error)
    }
})

//pay on delivery
router.post("/pay-on-delivery",async(req,res)=>{
    try {
      const  {
        firstname,
        lastname,
        customer_email,
        customer_address,
        customer_phone,
        customer_comment,
        items,
        quantity,
        total
        } = req.body

        const customer_name = firstname + ' ' + lastname
        const date = new Date().toLocaleString()
        console.log(items)

        let order_is_valid = true
        
                for(let i = 0; i < items.length; i ++){
                    const current = await Item.findById(mongoose.Types.ObjectId(items[i]))
                    
                    

                    if (current.quantity < quantity[i] || !current)
                    {  
                        console.log(`${current.quantity} is less than ${quantity[i]}`)
                        order_is_valid = false
                         
                          break; 

                    }
                
                    current_qty = parseInt(current.quantity)- parseInt(quantity[i])
                    if(current_qty < 0) current_qty = 0
                    current.quantity = current_qty
                    current.save()
                    
                }
     
      if (order_is_valid){
        const newOrder = new Order({
            customer_name,
            customer_email,
            customer_address,
            customer_phone,
            customer_comment,
            items,
            quantity,
            total,
            delivery_Status: false,
            paid_cash: false,
            tx_ref: "Na",
            transaction_id: "Na",
            date
            
        })
        
        newOrder.save()
        console.log(newOrder)
        res.json({newOrder, message:"order placed successfully"})

      }else{
        res.render("failure",{ message:"Problem placing your. please try again later"})
      }
        
    } catch (error) {
        console.log( "pay on delivery " +error)
    }
})
//edit one

router.post("/usecard",async(req,res)=>{
    try {
          req.session.transaction = req.body
          if (req.session.transaction)
            res.json(true)
    } catch (error) {
        console.log(error)
    }
})

//succesful payment via card

router.get("/success",async(req,res)=>{
    try {
        const transaction = req.session.transaction
        const date = new Date().toLocaleString()
        const {tx_ref, status, transaction_id} = req.query

        if(status == "successful"){
            const customer_name = transaction.firstname + ' ' + transaction.lastname
            const customer_email = transaction.customer_email
            const customer_address = transaction.customer_address
            const customer_phone = transaction.customer_phone
            const customer_comment = transaction.customer_commment
            const items = transaction.items
            const quantity = transaction.quantity
            const delivery_Status = false
            const paid_cash = true
            
            let order_is_valid = true
        
            for(let i = 0; i < items.length; i ++){
                const current = await Item.findById(mongoose.Types.ObjectId(items[i]))
                
                

                if (current.quantity < quantity[i] || !current)
                {  
                    console.log(`${current.quantity} is less than ${quantity[i]}`)
                    order_is_valid = false
                     
                      break; 

                }
            
                current_qty = parseInt(current.quantity)- parseInt(quantity[i])
                if(current_qty < 0) current_qty = 0
                current.quantity = current_qty
                current.save()
                
            }

            if(order_is_valid){
               
                const newOrder = new Order({
                    customer_name,
                    customer_email,
                    customer_address,
                    customer_phone,
                    customer_comment,
                    items,
                    quantity,
                    delivery_Status,
                    paid_cash,
                    tx_ref,
                    transaction_id,
                    date
                })
                
                newOrder.save()
                req.session.newOrder = newOrder
        
                console.log(newOrder)
                res.render(success, {message: `${customer_name}. Your transaction was successfull`})
            }
    

        }

    } catch (error) {
        console.log(error)
    }
})


router.post("/get-paid-order",async(req,res)=>{
    try {
        const newOrder = req.session.newOrder
        res.json(newOrder)
        
    } catch (error) {
        console.log(error)
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id)
        console.log(order)
        order.remove()
        res.json({status:true})
    } catch (error) {
        console.log(error)
    }
})

module.exports = router