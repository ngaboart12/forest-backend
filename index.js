const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const farmerRoutes = require('./Routes/Famer');
const authRoutes = require('./Routes//Auth');
const districtReport = require('./Routes/DistrictReport');
const app = express()
const path = require('path')
app.use(express.json())
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://ngaboart123:sevelin123@cluster0.hxpxs7e.mongodb.net/forest?retryWrites=true&w=majority').then(()=>{
    console.log('database are connected')
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', farmerRoutes);
app.use('/auth', authRoutes);
app.use('/district', districtReport);



app.listen(4000, (req,res)=>{
    console.log("appp are running on port 4000")
})