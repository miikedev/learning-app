const mongoose = require('mongoose');  
const Schema = mongoose.Schema;  

// Define the Course schema  
const courseSchema = new Schema({  
    userId: {  
        type: Schema.Types.ObjectId,  
        required: true, // Mandatory to link to a user  
        ref: 'User', // Reference to the User model  
    },  
    title: {  
        type: String,  
        required: true, // Title is mandatory  
        trim: true, // Removes whitespace from both ends  
    },  
    description: {  
        type: String,  
        required: true, // Description is mandatory  
        trim: true,  
    },  
    isPaid: {  
        type: Boolean,  
        required: true, // Indicates if the course is paid or free  
    },  
    courseFee: {  
        type: Number,  
        required: function() { return this.isPaid; }, // Course fee is required if the course is paid  
        min: 0, // Ensures the fee is a non-negative number  
    },  
    studentLimit: {  
        type: Number,  
        required: true, // Limit for the number of students  
        min: 1, // Ensures at least one student can enroll  
    },  
    hasEntranceExam: {  
        type: Boolean,  
        required: true, // Indicates if there is an entrance exam  
    }  
}, {  
    timestamps: true // Automatically manage createdAt and updatedAt timestamps  
});  

// Create a model from the schema  
const Course = mongoose.model('Course', courseSchema);  

// Export the model  
module.exports = Course;