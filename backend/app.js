const { ConstantPool } = require('@angular/compiler');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();

//connect to mongoose, get the string and password from the mongodb cluster connect, and change the db name here(node-angular) if needed, to create new db on the go
mongoose.connect('mongodb+srv://Zee:fTtM2pxavagKGKs2@cluster0.u3ju9.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('connection failed!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  //parse urlencoded data, generally not used

// app.use((req, res, next) => {
//   console.log("first middleware");
//   next();  //Goes to the next execution; else will end up as timeout
// });

// app.use((req, res, next) => {
//   res.send('Hello from express'); //since it is last, instead of timeout, we send back some response using 'res'
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;   //this works as export class
