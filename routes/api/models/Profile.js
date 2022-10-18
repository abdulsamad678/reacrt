const mongoose = require('mongoose');
const ProfileSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    company:{
        type:String,
        
        
    },
    website:{
        type:String,
        
    },
    location:{
        type:String
    },
    status:{
        type:String,
        
    },
    skill:{
        type:String,
    },
    bio:{
        type:String,
    },
    githubusername:{
        type:String,
    },
     experience:[
      {
          title:{
              type:String,
          },
          comapany:{
              type:String,
          },
          location:{
              type:String,
          },
          from:{
              type:String,
          },
          to:{
              type:String,
          },
          current:{
              type:String,
          },
          description:{
              type:String
          }
      }
     
  ] 

});
module.exports=Profile=mongoose.model('profile',ProfileSchema);