const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please enter username'],
        unique: [true, 'Already taken, enter new username'],
        lowercase: true,
        minLength: [4, 'Username must be more than 4 characters'],
        maxLength: [20, 'Username must be less than 20 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
        minLength: [11, 'Email must be more than 4 characters'],
        maxLength: [26, 'Email must be less than 20 characters'],
    },
    emailVerified: {
        type : Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minLength: [8, 'Minimum password length is 6 characters'],
        maxLength: [20, 'Maximum password length is 20 characters'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter password'],
        validate: {
            validator: function () {
                if(this.password === this.confirmPassword) {
                    return true;
                }
                return false;
            }, 
            message: "Password doesn't match",
        }
    },
    totalAdresses: {
        type: Number,
        default: 0,
    },
    firstName: { 
        type: String,
        maxLength: 30,
        default: ''
    },
    lastName: { 
        type: String,
        maxLength: 30,
        default: ''
    },
    gender: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    mobileNumberVerfied: {
        type: Boolean,
        default: false
    },
    addressName: {
        type: String,
        maxLength: 30,
    },
    apartmentName: {
        type: String,
        maxLength: 30,
    },
    areaName: {
        type: String,
        maxLength: 30,
    },
    city: {
        type: String,
        maxLength: 30,
    },
    state: {
        type: String,
        maxLength: 30,
    },
    addressName2: {
        type: String,
        maxLength: 30,
        default: '205',

    },
    apartmentName2: {
        type: String,
        maxLength: 30,
        default: 'Hill Residency',
    },
    areaName2: {
        type: String,
        maxLength: 30,
        default: 'Gandhi Nagar',
    },
    city2: {
        type: String,
        maxLength: 30,
        default: 'Chiplun',
    },
    state2: {
        type: String,
        maxLength: 30,
        default: 'Maharashtra',
    },
    landmark: {
        type: String,
        maxLength: 30,
    },
    autoLocate: {
        type: String,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    lastUpdated: {
        type: Date,
        default: () => Date.now(),
    },
    order1: [],
    order2: [],
    order3: [],
});

// fire a function before doc is saved to db
userSchema.pre('save', async function(next) {

    this.confirmPassword = '';
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth) {
            return user;
        }
        throw Error('Incorrect email')
    }
    throw Error('Incorrect email')
}

const User = mongoose.model('User', userSchema);

module.exports = User;
