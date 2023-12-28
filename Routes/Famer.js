const route = require('express').Router();
const FormDataModel = require('../models/farmer');
const IssuesModal = require('../models/Issues');
const IssusModel = require('../models/Issues')
const Final = require('../models/Finalreport')
const Production = require('../models/Production')
const nodemailer = require('nodemailer');
const multer = require('multer')
const path = require('path')


const user ='ngabosevelin@gmail.com' 

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user:user,
        pass:'zpfx qisa azei pnki'
    },
    tls: {
        // Add the following line to trust self-signed certificates
        rejectUnauthorized: false
    }
});
const generateFarmerId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

route.get('/farmers', async (req, res) => {
  try {
    // Retrieve all farmers from the database
    const allFarmers = await FormDataModel.find().sort({ createdAt: -1});

    res.json({ data: allFarmers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });




route.post('/register-farmer',  upload.fields([{ name: 'idCopy', maxCount: 1 }, { name: 'landCertificate', maxCount: 1 }]), async (req, res) => {
  try {
    const formData = JSON.parse(req.body.formData);
    const idCopy= req.file 

    formData.idCopy = {
      originalName: req.files['idCopy'][0].originalname,
      url: 'http://localhost:4000/uploads/' + req.files['idCopy'][0].filename,
    };
    formData.landCertificate = {
      originalName: req.files['landCertificate'][0].originalname,
      url: 'http://localhost:4000/uploads/' + req.files['landCertificate'][0].filename,
    };
    formData.farmerId = await generateFarmerId();
    const newFarmer = new FormDataModel(formData);
    newFarmer.actions = 'pending';

    const savedFarmer = await newFarmer.save();

    res.status(201).json(savedFarmer);
  } catch (error) {
    console.error('Error registering farmer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


route.put('/update-farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status, comment } = req.body;

    // Validate action value and other validation if needed

    // Update the actions field in the document
    const updatedData = await FormDataModel.findOneAndUpdate(
      { farmerId },
      { $set: { actions: status, comment: comment } },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ error: 'Farmer data not found' });
    }

    // Check if the status is 'allowed' or 'rejected' and send an email accordingly
    if (status === 'allowed' || status === 'rejected') {
      // Assuming personInfo is an object within FormDataModel with an emailAddress property
      const { personalInfo } = updatedData;
      const recipientEmail = personalInfo && personalInfo.emailAddress;

      if (recipientEmail) {
        let subject, emailText;

        if (status === 'allowed') {
          subject = `Approval Notification: Farmer ${personalInfo.fullName}`;
          emailText = `Congratulations! Your application for Farmer ${personalInfo.fullName} has been approved.'}`;
        } else {
          subject = `Rejection Notification: Farmer ${personalInfo.fullName}`;
          emailText = `We regret to inform you that your application for Farmer ${personalInfo.fullName} has been rejected. Comment: ${comment || 'No comment provided.'}`;
        }

        const mailOptions = {
          from: 'ngabosevelin@gmail.com',
          to: recipientEmail,
          subject,
          text: emailText
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      } else {
        console.warn('No email address found in personInfo');
      }
    }

    res.status(200).json({ message: 'Actions updated successfully', data: updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/single-farmer/:farmerId', async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    // Use findOne to find a farmer with the specified farmerId
    const farmer = await FormDataModel.findOne({ farmerId });

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    res.status(200).json(farmer);
  } catch (error) {
    console.error('Error retrieving farmer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/claim', async (req, res) => {
  try {
    const { title, description, farmerId } = req.body;

    // Save the form data to the MongoDB database
    const newClaim = new IssusModel({
      title,
      description,
      farmer:farmerId,
    });

    await newClaim.save();

    res.status(200).json({ success: true, message: 'Claim submitted successfully!' });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ success: false, message: 'Error submitting claim.' });
  }
});
route.post('/production', async (req, res) => {
  try {
    const { farmerId,cropname,quantity} = req.body;

    // Create a new Farmer instance
    const newProduction = new Production({
      farmer:farmerId,
      cropname,
      quantity
    });

    // Save the farmer to the database
    await newProduction.save();

    res.status(201).json({ message: 'production saved successfully' });
  } catch (error) {
    console.error('Error saving production:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


route.get('/get-production/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const production = await Production.find({ 'farmer':  { _id: farmerId }}).populate('farmer');
    res.json(production);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.get('/issues', async (req, res) => {
  try {
    const issues = await IssuesModal.find().populate('farmer');
    res.json(issues);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.get('/allowed/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const allowed = await Final.find({ 'farmer':  { _id: farmerId }}).populate('farmer');
    res.json(allowed);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/final', async (req, res) => {
  try {
    const { farmerId, follows } = req.body;

    // Create a new Farmer instance
    const newFinal = new Final({
      farmer:farmerId,
      follows,
    });

    // Save the farmer to the database
    await newFinal.save();

    res.status(201).json({ message: 'Farmer saved successfully' });
  } catch (error) {
    console.error('Error saving farmer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



route.post('/upload', upload.fields([{ name: 'idCopy' }, { name: 'landCertificate' }]), (req, res) => {
  const { idCopy, landCertificate } = req.files;

  // Save file information to MongoDB using Mongoose
  // You need to create a Mongoose model and handle the file saving logic here

  res.status(200).send('Files uploaded successfully!');
});



module.exports = route;
