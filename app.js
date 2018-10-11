var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');

var userRouter = require('./routes/user');
var chatRouter = require('./routes/chat');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/fb').then(()=>{
  console.log("mongodb connected")
})
.catch((err)=>{
  console.log("mongodb not connected"+err)
  process.exit(1)
})
app.use('/', userRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404,"Resourcs not found"));
});

// error handler
app.use(function(err, req, res, next) {
 console.log(process.env.NODE_ENV)
  let trace=process.env.NODE_ENV=="development"?err.stack:null;
  let jsonmsg={message:err.message,details:{code:err.statusCode||500}}
  if(trace){
    jsonmsg.details.trace=trace;
  }
  res.status(err.statusCode||500)
  res.send(jsonmsg);
  
});

module.exports = app;
