const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const Course = new Schema({
  name: { type: String, maxLength: 255 },
  description: { type: String, required: true, maxLength: 600 },
  image: { type: String, maxLength: 255 },
  video: { type: String, maxLength: 255, required: true },
  level: { type: String, maxLength: 255 },
  slug: { type: String, unique: true },
  energy: {type: String, maxLength:255}
}, {
  timestamps: true,
});

Course.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Course', Course);
