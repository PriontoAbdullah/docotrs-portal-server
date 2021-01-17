const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(BodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/${process.env
	.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
	const doctorCollection = client.db('doctorsPortal').collection('doctors');

	console.log('Doctors Portal DataBase Connected');

	//Routes -- Get method
	// Root Route
	app.get('/', (req, res) => res.send('Welcome to Doctors Portal Backed'));

    
	// Get all services Information
	app.get('/doctors', (req, res) => {
		doctorCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});


	//Routes -- Post method
	// Added all doctors Information
	app.post('/addDoctor', (req, res) => {
		const data = req.body;
		doctorCollection.insertMany(data).then((result) => {
			console.log(result);
			console.log(result.insertedCount, 'All Data Inserted');
			res.send(result.insertedCount);
		});
    });

    
});

const port = process.env.PORT || 5000;
app.listen(port, (err) => (err ? console.log('Filed to Listen on Port', port) : console.log('Listing for Port', port)));
