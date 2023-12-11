const mongoose = require('mongoose');

const finalSchema = new mongoose.Schema({
    follows: {
    type: Array,
    default: [],
  },
  farmer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer'
    }
});

const Final = mongoose.model('Final', finalSchema);

module.exports = Final;
