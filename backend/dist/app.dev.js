"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var cors = require("cors");

var PORT = 3100;
var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());

var db = require("./config/db").mongoUrl;

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Database connect successfully ".concat(db));
})["catch"](function (err) {
  console.log("Unable to database fail ".concat(err));
});

var Post = require('./routes/post');

app.use('/api/post', Post);
app.listen(PORT, function () {
  console.log("Server was running at port ".concat(PORT));
});