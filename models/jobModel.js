const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      qualifications: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: [true, "Please provide a duration"]
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
      },
});

module.exports = mongoose.model('Job', jobSchema);