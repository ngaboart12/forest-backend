const mongoose = require('mongoose');


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


// Create a main schema that includes the above schemas
const MainSchema = new mongoose.Schema({
  personalInfo: PersonalInfoSchema,
  addressDetails: AddressDetailsSchema,
  farmerActivities: FarmerActivitiesSchema,
  actions:String,
  farmerId: String,
  comment: {type:String, default: ""}
});

// Create a model using the main schema
const FormDataModel = mongoose.model('DistrictReport', MainSchema);

module.exports = FormDataModel;
