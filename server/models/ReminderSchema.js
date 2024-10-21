const mongoose = require('mongoose');

// Define the reminder schema
const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ['CA 1', 'CA 2', 'Semester 1', 'Semester 2', 'Lab Test 1', 'Lab Test 2', 'Semester Lab Exam', 'Important Announcement']
    },
    subject: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true,
        enum: ['G1', 'G2', 'G1 & G2']
    },
    year: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('Reminder', reminderSchema);
