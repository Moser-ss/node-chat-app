require('./config/config.js');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT

app.use(express.static(publicPath));
app.use((req, res, next ) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err){
            console.log('Unable to apped to server.log');
        }
    })   
    next();
})

app.get('/', (request, response) => {
    response.render(publicPath)
}) 
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})