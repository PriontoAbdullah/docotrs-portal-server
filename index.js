const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/${process.env
	.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const doctorCollection = client.db('doctorsPortal').collection('doctors');
	const appointmentCollection = client.db('doctorsPortal').collection('appointments');

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

	// Get all Booked Appointments
	app.get('/bookedAppointments', (req, res) => {
		appointmentCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	//Routes -- Post method
	// Added all doctors Information
	app.post('/addDoctor', (req, res) => {
		const doctorData = req.body;
		doctorCollection.insertMany(doctorData).then((result) => {
			console.log(result.insertedCount, 'All Data Inserted');
			res.send(result.insertedCount);
		});
	});

	// Insert Appointment Booking
	app.post('/makeBooking', (req, res) => {
		const appointmentData = req.body;
		appointmentCollection.insertOne(appointmentData, (err, result) => {
			console.log(result.insertedCount, 'Appointment Inserted');
			res.send(result.insertedCount > 0);
		});
	});

	// Insert A New Doctor
	app.post('/addADoctor', (req, res) => {
		const file = req.files.file;
		const id = req.body.id;
		const category = req.body.category;
		const name = req.body.name;
		const education = req.body.education;
		const designation = req.body.designation;
		const department = req.body.department;
		const hospital = req.body.hospital;
		const img = req.body.img;

		const newImg = file.data;
		const encImg = newImg.toString('base64');

		var image = {
			contentType: file.mimetype,
			size: file.size,
			img: Buffer.from(encImg, 'base64')
		};

		doctorCollection
			.insertOne({ id, category, name, education, designation, department, hospital, img, image })
			.then((result) => {
				res.send(result.insertedCount > 0);
				console.log(result.insertedCount, 'Doctor Inserted');
			});
	});

	//Routes -- Update method
	// Updating Booking Status
	app.post('/updateBookingStatus', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { status: ap.status },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Update Booking Status');
				}
			}
		);
	});

	// Updating Appointment Date/Time
	app.post('/updateAppointmentTime', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { date: ap.date, time: ap.time },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Update Appointment Date / Time');
				}
			}
		);
	});

	// Added Meeting Link
	app.post('/addedMeetingLink', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { meeting: ap.meeting },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Meeting Link Inserted');
				}
			}
		);
	});

	// Updating Appointment Visiting Status
	app.post('/updateVisitingStatus', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { visitingStatus: ap.visitingStatus },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Update Visiting Status');
				}
			}
		);
	});

	// Updating Prescription
	app.post('/updatePrescription', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { prescription: ap.prescription },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Update Prescription');
				}
			}
		);
	});

	// Updating Disease
	app.post('/updateDisease', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { disease: ap.problem },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Update Disease');
				}
			}
		);
	});

	// Added Payment
	app.post('/addedPayment', (req, res) => {
		const ap = req.body;
		appointmentCollection.updateOne(
			{ _id: ObjectId(ap.id) },
			{
				$set: { paymentID: ap.paymentID },
				$currentDate: { lastModified: true }
			},
			(err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: err });
				} else {
					res.send(result.modifiedCount > 0);
					console.log(result.modifiedCount, 'Payment Inserted');
				}
			}
		);
	});

});

const port = process.env.PORT || 5000;
app.listen(port, (err) => (err ? console.log('Filed to Listen on Port', port) : console.log('Listing for Port', port)));
