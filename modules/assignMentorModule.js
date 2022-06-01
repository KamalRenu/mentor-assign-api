const Student = require('../model/Student');
const Mentor = require('../model/Mentor');

exports.createStudent = async (req, res, next) => {
    const {name, email, course, mentorAssigned} = req.body;
    try {
        const student = await Student.create({
            name,
            email,
            course,
            mentorAssigned
        })
        return res.status(200).json({
            success: true,
            message: "Created Student Successfully"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        })
    }
}

exports.createMentor = async (req, res, next) => {
    const {name, email, expertise} = req.body;
    try {
        const mentor = await Mentor.create({
            name,
            email,
            expertise
        })
        return res.status(200).json({
            success: true,
            message: "Created Mentor Successfully"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message
        })
    }
}

exports.assignMentor = async (req, res, next) => {
    try {
        let studentArray = [];
        studentArray.push(req.body.studentList);
        let mentorStudents = await Mentor.findById(req.params.mentorId);
        mentorStudents = mentorStudents.studentList;
        await Promise.all(
            studentArray.map(async (elem) => {
                let student = await Student.findById(elem);
                if (!student.mentorAssigned){
                    let assignStudent = await Student.findByIdAndUpdate(elem,
                        {
                            $set: {mentorAssigned:req.params.mentorId},
                        },
                        {
                            new: true,
                        }).exec();
                        mentorStudents.push(elem);
                }
                let mentor = await Mentor.findByIdAndUpdate(
                    req.params.mentorId,
                    {$set: {studentList: mentorStudents}},
                    {
                        new: true,
                    }
                ).exec();
            })
        );
        res.status(200).json("Student assigned successfully")
    } catch (error) {
        return res.status(400).send("Error assigning student to mentor")
    }
}

exports.changeMentor = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        const mentorId = req.body.mentorAssigned;
        const { mentorAssigned } = await Student.findById(req.params.studentId);
        const currentMentorId = mentorAssigned.toString();

        if (currentMentorId === mentorId) {
          return res.status(200).json("Assigned mentor is same for this student");
        } else {
          // updating student db
          let student = await Student.findByIdAndUpdate(
            studentId,
            { $set: { mentorAssigned: mentorId } },
            { new: true }
          ).exec();
    
          //updating mentor db
          const { studentList } = await Mentor.findById(mentorId);
          let studentsArray = studentList;
          studentsArray.push(studentId);
          await Mentor.findByIdAndUpdate(
            mentorId,
            { $set: { studentList: studentsArray } },
            { new: true }
          ).exec();
    
          //updating current mentor db
          const id = await Mentor.findById(currentMentorId);
          let currentMentorsStudentArray = id.studentList;
          let index = currentMentorsStudentArray.indexOf(studentId);
          currentMentorsStudentArray.splice(index, 1);
          await Mentor.findByIdAndUpdate(
            currentMentorId,
            {
              $set: { studentList: currentMentorsStudentArray },
            },
            { new: true }
          ).exec();
          res.status(200).json(student);
        }
      } catch (error) {
        console.log("ERROR CHANGING MENTOR", error);
        return res.status(400).send("Error changing mentor");
      }
};

exports.unassignedStudents = async (req, res, next) => {
    try {
        let unassignedStudents = await Student.find({
          mentorAssigned: { $eq: null },
        }).exec();
        res.json(unassignedStudents);
      } catch (error) {
        console.log("ERROR GETTING UNASSIGNED STUDENTS INFO", error);
        return res.status(400).send("Error getting in unassigned students info");
      }
}

exports.mentorData = async (req, res, next) => {
    let response = await Mentor.find();
    res.send(response);
}

exports.studentData = async (req, res, next) => {
    let response = await Student.find();
    res.send(response);
}