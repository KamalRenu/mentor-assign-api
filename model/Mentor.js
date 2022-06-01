const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please provide email"]
    },
    expertise: {
        type: String,
        trim: true,
        required: [true, "Plaese provide expertise"]
    },
    studentList: []
},{timestamps: true});

const Mentor = mongoose.model("Mentor", mentorSchema)
module.exports = Mentor;