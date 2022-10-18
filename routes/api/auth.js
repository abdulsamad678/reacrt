const express = require('express')
const auth=require('./middleware/auth')
const router=express.Router();
const User=require('./models/User')
const jwt=require('jsonwebtoken')
const config=require('config')
const bcrypt=require('bcryptjs')
const { check, validationResult } = require('express-validator/check');


router.get('/new', auth, async(req,res)=>{
    try{
        console.log("Loader...")
     const user=await User.findById(req.user.id).select("-password");
     res.json(user);
    }catch(err){
    console.log(err.message);
     res.status(401).send({msg:"user not available"});
    }});




    router.post('/',
    [
      
        check('email','please include a valid email').isEmail(),
        check('password',' password is required').exists()

    ], 
    async(req,res)=> {
        console.log("object");
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const{ email, password,user}=req.body;
         
        try{
            console.log("Login...")
            let user= await User.findOne({email:email});
            if(!user){
                return res.status(400)
                .json({errors:[{msg:'invalid credentials'}]});
            }
            const ismatch=await bcrypt.compare(password, user.password);
            if(!ismatch){
                return res.status(400)
                .json(
                    {errors:[{msg:'invalid '}]});
            }
           // console.log("object")
           
            
            const payload={
                user:{
                    id:user.id,
                    role:user.role
                }
            }
            jwt.sign(
                payload,
                 config.get('jwtSecret'),
                 (err, token)=>{
                     if (err) throw err;
                     delete user.password;
                     res.json({user,token});
                 });
           // res.send("user Registered")
        }catch(err){
         console.error(err.message)
         res.status(500).send('server error : ' + err.message)
        }
    
        // console.log(req.body);
        });
module.exports=router;