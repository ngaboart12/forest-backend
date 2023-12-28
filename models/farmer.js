const mongoose = require('mongoose');

// Define schemas for each section
const PersonalInfoSchema = new mongoose.Schema({
  fullName: String,
  dateOfBirth: Date, // You might want to use a specific Date type based on your requirements
  gender: String,
  contactNumber: String,
  idNumber: String,
  emailAddress: String,
  educationLevel: String,
  status: String,
});

const AddressDetailsSchema = new mongoose.Schema({
  province: String,
  district:String,
  sector: String,
  cell: String,
  village: String,
});

const FarmerActivitiesSchema = new mongoose.Schema({
  province: String,
  district: String,
  sector: String,
  forestType: String,
  activityName: String,
  cropType: String,
  farmerAbility: String,
  supportType: String,
  workStatus: String,
});

const ApproveCommentSchema = new mongoose.Schema({
  location: {type:String,default:""},
  goodcrop: {type:String,default:""},
  goodforest: {type:String,default:""},
})

// Create a main schema that includes the above schemas
const MainSchema = new mongoose.Schema({
  personalInfo: PersonalInfoSchema,
  addressDetails: AddressDetailsSchema,
  farmerActivities: FarmerActivitiesSchema,
  actions:String,
  farmerId: String,
  comment: {type: String,default: ''},
  approveComment: ApproveCommentSchema,
  idCopy: {
    originalName: String,
    url: String, // Assuming you want to store the URL
  },
  landCertificate: {
    originalName: String,
    url: String, // Assuming you want to store the URL
  },


}, {timestamps:true});

// Create a model using the main schema
const Farmer = mongoose.model('Farmer', MainSchema);

module.exports = Farmer;
