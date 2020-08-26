const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 3100;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

const db = require("./config/db").mongoUrl;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Database connect successfully ${db}`);
  })
  .catch((err) => {
    console.log(`Unable to database fail ${err}`);
  });

const Post = require('./routes/post');
app.use('/api/post', Post)

app.listen(PORT, () => {
  console.log(`Server was running at port ${PORT}`);
});
