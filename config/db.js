const mongoose= require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectdb = async ()=>{
    console.log("here")
    try{
        await mongoose.connect(db);
        console.log('mongodb is connected now');
    }catch(err){
        console.error(err.message);
        
       
    }
}
module.exports = connectdb;