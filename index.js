const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const mongoose = require("mongoose")
app.use(bodyParser())
app.use(bodyParser.json())

//ejs setup
const ejs = require("ejs")
app.set('view engine','ejs')

// method override
const methodOverride = require("method-override")
app.use(methodOverride("_method"))

//session setup
const session = require("cookie-session")
app.use(session({secret:'secret',
resave:true,
saveUninitialised:true,

maxAge: 1000 * 60 * 15,
cookie:{
    secure: true
       }

}))
const port = process.env.PORT||3000

//set up public folder
app.use(express.static(__dirname +"/public"))

// custom middlewares
const  isAdmin = (req,res,next)=>{
    if(req.user.admin) return next()
    else{
        res.redirect('/login-admin123')
    }
}

const isAuth = (req,res,next)=>{
    if (req.session.user||req.session.admin){
        return next()
    }
    else {
        res.redirect('/login')
    }
   }

const loggedout = (req,res,next)=>{
    if(!isAdmin()||!isAuth()) return next()
    else{
        res.redirect('/')
    }
}


//dbconnection
mongoose.connect(``${process.env.DATABASE})
.then(()=>console.log('database connected'))
.catch((error)=>{console.log(`database connection error: ${error}`)})

const pages = require("./controllers/pages")
const orders = require("./controllers/orders")
const items = require("./controllers/items")
const gallery =  require("./controllers/gallery")
const auth = require("./controllers/auth")

app.use("/",pages)
app.use("/items",items)
app.use("/orders",orders)
app.use("/gallery-images",gallery)
app.use("/auth",auth)

     // 404 catch-all handler (middleware)
    app.use(function(req, res, next){
    res.status(404);
    res.render('404');
    });
    // 500 error handler (middleware)
    app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
    });






app.listen(port,()=>console.log(`server started on port ${port} ${process.env.OK}`))
