const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/my_education_dev');
    console.log('Connect Successfully!');
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
