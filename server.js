const { application } = require('express');
const express = require ('express');
const connectdb= require('./config/db');
const cors = require("cors")

const app =express();

connectdb();
app.use(cors())
app.use(express.json({extended:false}));
app.get('/', (req,res)=>res.send('api running'));
app.use('/api/users', require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server started on port ${PORT}`));