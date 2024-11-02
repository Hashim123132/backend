const mongoose = require('mongoose');

const mongooseURI = 'mongodb://localhost:27017/iNotebook';

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongooseURI); 
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.log("Error connecting to Mongo", error);
  }
}

module.exports = connectToMongo;

