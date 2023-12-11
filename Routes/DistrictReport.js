const route = require('express').Router();
const Farmer = require('../models/farmer')

route.put('/report', async (req, res) => {
  
  try {
    const status = "underwayrab"
    const result = await Farmer.updateMany({ actions: 'approved' }, { $set: { actions: status } });
    res.json({ message: `${result.nModified} users with status 'approved' updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
    
  });

module.exports = route;