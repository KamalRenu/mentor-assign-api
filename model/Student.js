const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
    course: {
        type: String,
        trim: true,
        required: [true, "Please provide course"]
    },
    mentorAssigned: {
        type: String,
        trim: true
    },
},{timestamps: true});

const Student = mongoose.model("Student", studentSchema)
module.exports = Student;