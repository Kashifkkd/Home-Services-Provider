const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User')
const Business = require('../models/Business')
dotenv.config();

const requireAuth = (req,res,next) => {

    const token = req.cookies.jwt;
    console.log(token)

    // check json web token exists & is verified
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err,decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login')
            } else{
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

const checkUserBusiness = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err,decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                console.log('1st error')
                next();
            } else{
                let user = await Business.findById(decodedToken.id);
                res.locals.user = user
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err,decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                console.log('1st error')
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser, checkUserBusiness }