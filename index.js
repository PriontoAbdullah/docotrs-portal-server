const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(BodyParser.json());

const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/${process.env
.DB_NAME}?retryWrites=true&w=majority`;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Routes -- Get method
// Root Route
app.get('/', (req, res) => res.send('Welcome to Doctors Portal Backed'));



const port = process.env.PORT || 5000;
app.listen(port, (err) => (err ? console.log('Filed to Listen on Port', port) : console.log('Listing for Port', port)));
