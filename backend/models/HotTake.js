const mongoose = require('mongoose');

const hotTakeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280
  },
  agrees: {
    type: Number,
    default: 0
  },
  disagrees: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HotTake', hotTakeSchema);