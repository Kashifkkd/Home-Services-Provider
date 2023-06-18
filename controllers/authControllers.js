const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

dotenv.config();

// handle errors
const handleErrors = (err) => {

    let errors = { username: '', email: '', password: '', confirmPassword: '', loginVerification: ''};
    // duplicate error code (for mail)

    if(err.message === 'Incorrect email'){
        errors.loginVerification = 'Incorrect email or Password';
    }
  
    if(err.code == 11000) {
        if(err.keyPattern['username'] === 1) {
            errors.username = 'Username already exist, enter new';
        }
        if(err.keyPattern['email'] === 1) {
            errors.email = 'Email already exist, enter new email';
        }
        return errors;
    }

    // validation errors
    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
}

// hashing password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const _password = await bcrypt.hash(password,salt);
    return _password;
}

const passwordResetEmail = (email,username,link) => {
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
        subject: 'JOAD Password Reset',
        text: `Dear ${username},
        You recently requested for a password reset from your JOAD account. You can find your one-time password reset link below and reset your password easily.

        link - ${link}

        If it wasn't you who requested for a password reset, or accidentally made a request, ignore this email. Worry not, your password won't be changed unless initiated by you.

        Thanks,
        Team JOAT.
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};
  
const signup_get = (req,res) => {
    res.render('signup.ejs');
}

const login_get = (req,res) => {
    res.render('login.ejs');
}

const signup_post = async (req,res) => {

    const { username, email, password, confirmPassword } = req.body;

    try{
        const user = await User.create({ username, email, password, confirmPassword});
        console.log('user created')
        res.status(201).json({ user: user._id });
    } catch(err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req,res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000 });
        res.status(200).json({ user: user._id });
        // res.redirect('/services');
    
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
        console.log(err.message);
    }
}

const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}

const forgotPassword_get = (req, res) => {
    res.render('forgot-password.ejs');
}

const forgotPassword_post = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email : email })
    
    if(user) {
        const secret = process.env.TOKEN_SECRET + user.password;
        res.status(200).json({ user })
        const id = user._id;
        const token = jwt.sign({ id }, secret, { expiresIn: '10m' })
        const link = `http://localhost:3000/reset-password/${id}/${token}`;
        console.log('Link: ',link)
        passwordResetEmail(email,user.username,link);
        console.log('Link sended successfully');
    } else {
        console.log('Not exists');
        res.status(400).json({ errors: "User doesn't exist" })
        return;
    }
}

const resetPassword_get = async (req, res) => {
    const { id, token } = req.params

    // check valid or not
    const currentUser = await User.findById(id)
    if(!currentUser){
        res.redirect('/forgot-password');
    }
    
    try{
        const secret = process.env.TOKEN_SECRET + currentUser.password;
        const verified = jwt.verify(token,secret)
        res.render('reset-password', { email: currentUser.email, id, token})
    } catch(err) {
        console.log(err.message);
        res.send('Link Expired.');
    }
}

const resetPassword_post = async (req,res) => {
    const { password, id, token } = req.body
    const user = await User.findById(id);
    
    if(!user){
        res.redirect('/forgot-password')
    }

    const secret = process.env.TOKEN_SECRET + user.password;
    
    try{
        const verified = jwt.verify(token,secret)
        const hashedPassword = await hashPassword(password)

        const updatePassword = { password: hashedPassword }
        await user.updateOne(updatePassword)

        const updatedUser = await User.findById(id);
        res.status(200).json({ user: user._id })
    }catch(err) {
        console.log('error while updating')
        res.status(400).json({ err })
    }
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout,
    forgotPassword_get,
    forgotPassword_post,
    resetPassword_get,
    resetPassword_post,
}