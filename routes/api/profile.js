const express = require('express')
const router=express.Router();
const config=require('config')
const request=require('request')
const Profile= require('./models/Profile')
const User =require('./models/User')
const auth =require('./middleware/auth')
const mongoose  = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
router.get('/me',auth, async (req,res)=>{
    try{
       const profile=await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
       if(!profile){
       return res.status(400).send({msg:"no profile exsist"})
       }
       res.send(profile)
    }catch(err){
console.log(err.message);
return res.status(500).send("internal server error")
    }
});
router.post('/', auth, async(req,res)=>{
    
    const{company, website, location,status,skill,bio,githubusername,}=req.body;
    console.log("helppppppppppp"+JSON.stringify(req.body));
    
        
        const profiles={};
        profiles.user=req.user.id;
        if (company) profiles.company=company;
        if(website)profiles.website=website;
        if(location)profiles.location=location;
        if(status)profiles.status=status;
        if(skill)profiles.skill=skill;
        if(bio)profiles.bio=bio;
        if(githubusername)profiles.githubusername=githubusername;
        // if(skill){
        //     profile.skill=skill.split(",").map(skill=>skill.trim());
        // }
        console.log("summmmmmm"+githubusername)
        console.log("req.user.id : "+req.user.id)
        //res.send("hhh")

        try{
            let profile= await Profile.findOne({user:req.user.id});
            if(profile){
                profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profiles},{new:true});
                return res.json(profile)
            }
            profile=new Profile(profiles);
            await profile.save();
             res.json(profile)
        }
    catch(err){
     console.log(err.message);
     return res.status(500).send('internal server error')
    }
});
router.get('/user/:user_id', async(req,res)=>{
    try{
        const profiless=await Profile.findOne({user:req.params.user_id}).populate('user',['name', 'avatar']);
        if(!profiless){
            return res.status(400).send({msg:"no profile exsist here"})
        }
        res.json(profiless);
      
    }catch(err){
        console.log(err.message)
        if(err.kind=='ObjectId'){
            return res.status(400).send({msg:"no profile exsist here"})
        }
    
    return res.status(500).send("internal server error")
    }
});
router.delete('/',auth ,async(req,res)=>{
    try{
      await Profile.findOneAndRemove({user:req.user.id});
      await User.findOneAndRemove({_id:req.user.id});
      res.json({msg:"user deleted"})
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
router.put('/experience',auth ,async(req,res)=>{
    const {title,company,location,from,to, current, description}=req.body;
    const newexp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try{
    const profile=await Profile.findOne({user:req.user.id});
    console.log(profile);
    profile.experience.unshift(newexp);
    await profile.save();
    res.json(profile);
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
router.delete('/experience/:exp_id',auth ,async(req,res)=>{
    try{
     const profile=await Profile.findOne({user:req.user.id});
     const remove=profile.experience.map(item=>item.id).indexof(req.params.exp_id);
     profile.experience.splice(remove);
     res.json({msg:"user deleted"})
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});

router.get('/github/:username',(req,res)=>{
    console.log("req"+req)
    console.log("ddddddddddddddd")
    try{
     const options={
         
         uri:`http://api.github.com/users/${req.params.username}/repos?client_id=${config.get('githubclientId')}
          &secretid=${config.get('usersecretId')}`,
          method:'GET',
          headers:{'user-agent':'nodejs'}
         
     };
     console.log("ddddddddddddddd")
     request(options,(error,response,body )=>{
        //console.log("ddddddddddddddd"+body)
         if(error){
             console.error(error)
         }
         if(response.statusCode!==200){
            return res.status(400).json({msg:"no github profile"})
         }
         
        // console.log("ddddddddddddddd"+body)
         res.json(JSON.parse(body))
     });
     
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
module.exports=router;


// const gravatar=require('gravatar')
// const bcrypt=require('bcryptjs')
// const jwt=require('jsonwebtoken')
// const config=require('config')
// const jwtSecret = config.get('jwtSecret');