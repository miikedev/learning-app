const Course = require('../models/Course');  
const User = require('../models/User');  

// Example function to create a new course  
const createCourse = async(courseData, userId) => {  
    try {  
        const newCourse = new Course({  
            userId: userId, // Pass the User's ID here  
            title: courseData.title,  
            description: courseData.description,  
            isPaid: courseData.isPaid,  
            courseFee: courseData.isPaid ? courseData.courseFee : undefined,  
            studentLimit: courseData.studentLimit,  
            hasEntranceExam: courseData.hasEntranceExam,  
        });  

        const savedCourse = await newCourse.save();  
        return savedCourse; // Successfully created course  
    } catch (error) {  
        throw new Error('Error creating course: ' + error.message);  
    }  
}

module.exports = { createCourse }