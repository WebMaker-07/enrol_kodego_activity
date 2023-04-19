let express = require('express');
const path = require('path');
const env = require('dotenv');
const mysql = require('mysql2');
const app = express();
const port = 5008;
env.config({
    path: './.env'
}) 

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: true}));



app.use('/',require('./routes/register_routes'))
app.use('/auth', require('./routes/auth'))
app.use(express.json());
app.listen(port, ()=>{
    console.log(`Server has started`);

})