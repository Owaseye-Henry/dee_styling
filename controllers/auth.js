const express = require("express")
const router  = express.Router()
const bcrypt = require("bcrypt")

const Admin = require("../Schemas/admin")




function isAuth (req,res,next){
    if (req.session.user||req.session.admin){
        return next()
    }
    else {
        res.redirect('/auth/login')
    }
   }

function loggedout (req,res,next){
    if(!req.session.admin||!req.session.user) return next()
    else{
        res.redirect('/')
    }
}



router.get("/register",loggedout, async(req,res)=>{
    try {
        res.render('register',{url1:"/auth/register", url2:"/auth/login"})
    } catch (error) {
        console.log(error)
    }
  })

router.post("/register",loggedout,async(req,res)=>{
    try {
         const admin = await Admin.find({})
         const admin_length = admin.length

         if(admin_length < 1){
        
            const {Firstname,Surname,Email,Username,Password1,Password2}= req.body
            let Password;
            const Fullname = `${Firstname} ${Surname}`
            if(Password1 == Password2){
                const securePassword = await bcrypt.hash(Password1,12)
                Password = securePassword;
            
                    const newUser = new Admin({
                        Name:Fullname,
                        Email,
                        Username,
                        Password
                    })
                    await newUser.save()
        
                    res.render('login',{url:"/auth/login-admin123",signup:"/auth/register-admin123",message:`you have successfully signed up,please login`})
                    console.log(newUser)

                } else{
                    res.send("<h1> Signup Failed</h1> <p> please try again</p>")
                }
        
           
        }else{
            res.redirect("/")
        }
        
       
    } catch (error) {
        console.log(error)
    }
})


//edit admin
router.get("/edit",isAuth,async(req,res)=>{
    try {
        const user = req.session.user
        res.render('edit-admin',{user})
        
    } catch (error) {
        console.log(error)
    }
})
router.put("/edit:id",isAuth,async(req,res)=>{
    try {
        let user = await Admin.findById(req.params.id)
        const {Firstname,Surname,Email,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;

            
            user.Email = Email;
            user.Fullname = Fullname;
            user.Username = Username;
            user.Password = Password;
            await user.save()

            console.log(user)
            res.render('success',{message:`You have successfully updated your profile`,url:'/'})

        }
       
    } catch (error) {
        console.log(error)
    }
})

//login
router.get("/login",loggedout,async(req,res)=>{
    try {
        res.render('login',{message:""})
    } catch (error) {
        console.log(error)
    }
})


router.post("/login",loggedout,async(req,res)=>{
    try {
        const {Username,Password} = req.body
        const user = await Admin.findOne({Username})
    
        if(!user)
        {
            res.render('login',{url:'/auth/login-admin123',signup:"register-admin123",message:"invalid username or password"})
        }
        const passwordHash = bcrypt.compareSync(Password, user.Password)
        if(!passwordHash)
        {
            res.render('login',{url:'/auth/login-admin123',signup:"register-admin123",message:"invalid username or password"})
        }
        else{
            req.session.user = user;
            req.session.admin = user
          

              res.redirect('/admin')
        }

    } catch (error) {
        console.log("admin login error" + error)
    }
})




router.get("/logout",async(req,res)=>{
    try {
        req.session.user = null;
        req.session.admin=null
        

        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;