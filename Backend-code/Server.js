const express = require('express');
const PORT = 8080;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGOBD_URL} = require('./config')

mongoose.connect(MONGOBD_URL);

mongoose.connection.on('connected',()=>{
    console.log("DB connected");
})
mongoose.connection.on('error',(error)=>{
    console.log("some error found")
})


require('./models/userTwitter_model');
require('./models/tweetHomePage');







app.use(cors());
app.use(express.json());

require('./models/userTwitter_model')
app.use(require('./routes/userTwitter_route'));

require('./models/tweetHomePage')
app.use(require('./routes/tweetHomePage_route'));




app.listen(PORT,()=>{
    console.log("Server Started");
});