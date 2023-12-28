const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    province: String,
    district: String,
    sector: String,
    role: { type: String,},
  });

const UserDataModal = mongoose.model('Users', userSchema);

module.exports = UserDataModal;
