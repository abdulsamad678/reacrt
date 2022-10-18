const express = require('express')
const router=express.Router();
const User= require('./models/User')
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const jwtSecret = config.get('jwtSecret');
const { check, validationResult } = require('express-validator/check');
router.post('/',[
    check('name','name is required')
    .not()
    .isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password','please enter 6 character passord').isLength({min:5})
], async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
  
    console.log("in backenddddddddddddddddddd")
    const{name, email, password}=req.body;
     console.log("object"+JSON.stringify(req.body))
     console.log("zzzzzzzzzzzcxccccccccccccccccxzcxzc")
    try{
        let user= await User.findOne({email:email});
        if(user){
            return res.status(400).json({errors:[{msg:'user already exsists'}]});
        }
        console.log("object")
        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
         user= new User({
            name,
            email,
            avatar,
            password,

        });
        const salt=await bcrypt.genSalt(10);
        // let newSalt;
        // await bcrypt.genSalt(10, function(err, salt) {
        //     // returns salt
        //     if(err){ console.log("salt err : " + err.message)}
        //     newSalt = salt;
        // });
        // console.log("reach")
        console.log("salt : " + JSON.stringify(salt))
        // console.log("newSalt : " + JSON.stringify(newSalt))
        user.password=await bcrypt.hash(password,salt);
        await user.save();
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(
            payload,
             config.get('jwtSecret'),
             (err, token)=>{
                 if (err) throw err;
                 res.json({token});
             });
       // res.send("user Registered")
    }catch(err){
     console.error(err.message)
     res.status(500).send('server error : ' + err.message)
    }

    // console.log(req.body);
    });
module.exports=router;