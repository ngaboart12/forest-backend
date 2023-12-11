const mongoose = require('mongoose')

const IssuesSchema = mongoose.Schema({
    title: String,
    description: String,
    farmer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer'
    }

})
const IssuesModal = mongoose.model('issues', IssuesSchema);

module.exports = IssuesModal;