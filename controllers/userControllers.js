const User = require('../models/User');
const Business = require('../models/Business');
const Vonage = require('@vonage/server-sdk');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config();
let currentOTP;

const userProfile_get = async (req,res) => {
    const username = req.params.id;
    const user = await User.findOne({ username })

    fName = user.firstName;
    lName = user.lastName;
    emailAddress = user.email;
    mNumber = user.mobileNumber;
    gender = user.gender;
    mNumberVerified = user.mobileNumberVerfied;
    emailVerified = user.emailVerified;
    totalAddresses = user.totalAdresses;
    roomNum = user.addressName;
    buildingName = user.apartmentName;
    streetName = user.areaName;
    cityName = user.city;
    stateName = user.state;

    res.render('profile.ejs', { username, fName, lName, emailAddress, mNumber, gender, mNumberVerified, emailVerified, totalAddresses, roomNum, buildingName, streetName, cityName, stateName});
}

const userProfile_post = async (req,res) => {

    const { username, firstName, lastName, gender, mobileNumber } = req.body;
    const { hName,streetName, areaName, cityName, stateName } = req.body;
    console.log(hName,streetName, areaName, cityName, stateName);
    
    
    try{
        const user = await User.findOne({ username });
        const updateUserData = { firstName, lastName, gender, mobileNumber, addressName: hName, apartmentName: streetName, areaName, city: cityName, state: stateName };
        await user.updateOne(updateUserData);
        const updatedUser = await User.findById(user._id);
        console.log(updatedUser);
        res.status(200).json({ user : updatedUser._id })
    } catch(err){
        console.log(err)
        res.status(400).json({ err });
    }
}

const vonage = new Vonage({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
})

function generateOTP(){
    const digit = '0123456789';
    let otp = '';

    for(var i=0; i<4; i++){
        otp += digit[Math.floor(Math.random() * 10)];
    }

    return otp;
}

const sendOTP = async (req,res) => {

    const { currentNumber } = req.body;
    const vonage = new Vonage({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET
    })
    sendMessage(currentNumber);
    console.log('Send Otp:', currentOTP);

    res.status(200).json({ sended: true });
}

const verifyOTP = async (req,res) => {
    const { otpValue, username, currentNumber } = req.body;
    console.log(otpValue,username,currentNumber);
    console.log('Current OTP: ', currentOTP)
    if(currentOTP === otpValue){
        console.log('Verified')

        const user = await User.findOne({ username });
        console.log(user);

        const updatedUser = await user.updateOne({ mobileNumberVerfied: true, mobileNumber: currentNumber })
        console.log(updatedUser)

        res.status(200).json({ verified : true})
    } else{
        console.log('Not verified')
        res.status(400).json({ errors: 'Incorrect OTP' })
    }
}

const sendVerificationEmail = async (req,res) => {
    
    const { currentEmail, username } = req.body;

    const user = await User.findOne({ username });
    const id = user._id
    const token = jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '5m' });
    console.log('sendVerificationEmail: ',token)
    const link =  `http://localhost:3000/verify-email/${id}/${token}`;

    sendVerificationEmailMessage('en19216612@git-india.edu.in',username,link);
    res.status(200).json({ sended : true});
}

const verifyEmail = async (req,res) => {
    
    const { username } = req.body;
    const user = await User.findOne({ username });
    console.log('Current verify email', username);
    console.log(user);
    if(user.emailVerified === true){
        console.log('Verified Email')
        res.status(200).json({ verified : true })
    } else {
        console.log('not verified')
        res.status(400).json({ verified : false})
    }
}

const serviceOrder = async (req,res) => {
    const { id } = req.params;
    console.log('ID:',id)

    try{
        const user = await User.findOne({username: id});
        console.log(user);
    
        const order = user.order1;
        console.log(order);
        // console.log(order[0].shopname)
    
    
        var timeStamp= order[0].time
        const date= new Date(timeStamp);
    
        const dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
    
        console.log(dateFormat);
        // const odate = new Date(order[0].time);
        // const cdate = odate.toLocaleDateString('en-US');
        // console.log(cdate)
    
        res.render('orders', { shopname: order[0].shopname, service: order[0].service, price: order[0].price, date: dateFormat});

    } catch(err){
        console.log(err)
    }
}

const verifyEmail_get = async (req, res) => {

    console.log('verify-email.......')
    const { id,token } = req.params
    console.log(id,token)

    const user = await User.findById(id);
    console.log(user);
    
    try{
        const verifyToken = jwt.verify(token,process.env.TOKEN_SECRET)
        console.log('verify-token',verifyToken)

        await user.updateOne({ emailVerified: true })

        const updatedUser = await User.findById(id);

        console.log(updatedUser)

        res.render('verified-email');
    } catch(err){
        res.send('Link Expired');
    }
}

function sendMessage(number){
    const from = "Team JOAT"
    const to = '91'+number;
    currentOTP = generateOTP();
    const text = `Your JOAT verification code is : ${currentOTP}.\nValid for 5 minutes.`

    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}

const sendVerificationEmailMessage = (email,username,link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'being.anonymous048@gmail.com',
            pass :'zdnmhiewwougwwai'
        }
    })
    
    const mailOptions = {
        from: 'being.anonymous048@gmail.com',
        to: email,
        subject: 'JOAT Verification Email',
        text: `Dear ${username},\nPlease confirm that you want to use this email address with your JOAT account. If you did not request this change, then feel free to ignore this email. \n\n Link - ${link} \n\n\nRegards,\nTeam JOAT.`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};

module.exports = {
    userProfile_get,
    userProfile_post,
    sendOTP,
    verifyOTP,
    sendVerificationEmail,
    verifyEmail,
    verifyEmail_get,
    serviceOrder,
}