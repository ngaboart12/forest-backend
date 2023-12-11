const route = require('express').Router();
const FormDataModel = require('../models/farmer');
const IssuesModal = require('../models/Issues');
const IssusModel = require('../models/Issues')
const Final = require('../models/Finalreport')
const Production = require('../models/Production')


// farmerRoutes.js

const generateFarmerId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

route.get('/farmers', async (req, res) => {
  try {
    // Retrieve all farmers from the database
    const allFarmers = await FormDataModel.find();

    res.json({ data: allFarmers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/register-farmer', async (req, res) => {
  try {
    const formData = req.body;

    // Generate a farmerId with 6 digits
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
    const { status,comment } = req.body; // Assuming you send the new action value in the request body

    // Validate action value (optional)


    // Update the actions field in the document
    const updatedData = await FormDataModel.findOneAndUpdate(
      { farmerId },
      { $set: { actions: status,comment: comment } },
      { new: true } // To return the updated document
    );

    if (!updatedData) {
      return res.status(404).json({ error: 'Farmer data not found' });
    }

    res.json({ message: 'Actions updated successfully', data: updatedData });
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

module.exports = route;
