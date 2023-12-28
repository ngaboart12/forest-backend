const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  idCopy: String,
  landCertificate: String,
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
