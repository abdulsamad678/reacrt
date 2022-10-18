const express = require('express')
const router=express.Router();
const config=require('config')
const request=require('request')
const Profile= require('./models/Profile')
const User =require('./models/User')
const auth =require('./middleware/auth')
const Post=require('./models/Post')
const mongoose  = require('mongoose');
router.post('/', auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        const newpost=new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id,
            user:req.user.role,

        });
        const post=await newpost.save();
        return res.json(post)

    }catch(err){
     console.log(err.message)
     return res.status(500).send('internal server error')
    }
  
    
});
router.post('/comments/:id', auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        const post=await Post.findById(req.params.id);
        const newcomments={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };
        post.comments.unshift(newcomments);
        await post.save();
        return res.json(post.comments)

    }catch(err){
     console.log(err.message)
     return res.status(500).send('internal server error')
    }
  
    
});
router.get('/',auth, async(req,res)=>{
    try{
        
        const post=await Post.find().sort({date:-1});
        return res.json(post);
    }catch(err){
        console.log(err.message)
        return res.status(500).send('internal server error')
    }
});
router.get('/:id',auth, async(req,res)=>{
    try{
        
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(400).send({msg:"user not available"})
        }
        res.json(post);
    }catch(err){
        if(err.kind=='ObjectId'){
            return res.status(400).send({msg:"user not available"})
        }
        console.log(err.message)
        return res.status(500).send('internal server error')
    }
});
router.delete('/:id',auth ,async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     if(!post){
         return res.status(400).send({msg:"post not available"})
     }
     if(post.user.toString()!==req.user.id){
         return res.status(401).send({msg:"unauthorized"})
         
     }
     await post.remove(),
     res.json({msg:"post deleted"})
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
router.put('/likes/:id',auth ,async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     if(
         post.likes.filter(like=>like.user.toString() === req.user.id).length>0
     ){
         return res.status(400).json({msg:"post already liked"})
     }
     
      post.likes.unshift({user:req.user.id});
      await post.save();
     res.json(post.likes);
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
router.put('/unlikes/:id',auth ,async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     if(
         post.likes.filter(like=>like.user.toString() === req.user.id).length===0
     ){
         return res.status(400).json({msg:"post has not been liked yet"})
     }
     const remove=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
     post.likes.splice(remove,1);
     await post.save();
     
      
     res.json(post.likes);
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
router.delete('/comments/:id/:comments_id',auth ,async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     const comment=post.comments.find(comment=>comment.id=req.params.comments_id);
     if(!comment){
         return res.status(400).send({msg:"comment not available"})
     }
     if(comment.user.toString()!==req.user.id){
        return res.status(400).send({msg:"unauthorized user"})
     }
     const remove=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
     post.comments.splice(remove,1);
     await post.save();
     res.json(post.comments);
    }catch(err){
    console.log(err.message)
    return res.status(500).send('internal server error')

    }
});
module.exports=router;


