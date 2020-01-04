const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: "Name cannot be empty."
    },
    email: {
        type: String,
        required: "Email is compulsary."
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    }
});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return emailRegex.test(val);
}, 'Invalid E-mail');

mongoose.model('Employee', employeeSchema);