const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
  title: String,
  location: String,
  price: String,
  description: String,
})

module.exports = mongoose.model('CampGround', CampGroundSchema)