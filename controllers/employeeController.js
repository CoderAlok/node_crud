const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    // res.json('sample text');
    res.render("employee/addOrEdit", {viewTitle: "Insert Employee"});
});

router.post('/', (req, res) => {
    // console.log(req.body);
    insertRecord(req, res);
});

router.post('/', (req, res) => {
    if(req.body._id == ''){
        insertRecord(req, res);
    }
    else{
        updateRecord(req, res);
    }
});

// To insert into table
function insertRecord(req, res){
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        if(!err){
            res.redirect('employee/list');
        }
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else{
                console.log('Error during record insertion : '+err);
            }
        }
    });
}

// new : true // means it will have the upadted record of the page
// new : false // Means it will have the old record of that page
function updateRecord(req, res){
    Employee.findOneAndUpdate({ _id: req.body._id}, req.body, { new: true }, (err, doc) => {
        if(!err){
            res.redirect('employee/list');
        }
        else{
            if(err.name = 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
        }
    });
}

router.get('/list', (req, res) => {
    // res.json('from list');
    Employee.find((err, doc) => {
        if(!err){
            res.render('employee/list', {
                list: doc
            });
        }
        else{
            console.log('Error in retrieving employee list : '+err);
        }
    });
});

function handleValidationError(err, body){
    for(field in err.errors){
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render('employee/addOrEdit', {
                viewTitle: "Update Employee", 
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log('Error in employee delete : ' +err);
        }
    });
});

module.exports = router;