const mongoose = require('mongoose')

const ProductionSchema = mongoose.Schema({
    cropname: String,
    quantity: String,
    farmer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer'
        }

})
const productModal = mongoose.model('Production', ProductionSchema);

module.exports = productModal;