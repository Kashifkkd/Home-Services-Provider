const User = require('../models/User');
const { requireAuth, checkUser, checkUserBusiness } = require('../middleware/authMiddleware')
const dotenv = require('dotenv');
const Business = require('../models/Business');
// const fetch = (...args) =>
// 	import('node-fetch').then(({default: fetch}) => fetch(...args));
dotenv.config();

const servicesDashboard = (req, res) => {

    res.render('services/home.ejs');
}

const shopList_get = (req, res) => {

    const {username,city, area, service } = req.params;
    console.log(username,city,area,service);

    res.render('services/shop-list', {username, city, area, service})
}

const shopList_post = (req, res) => {

    const { username,city, area, service } = req.params;
    console.log(username,city,area,service);
}

const serviceDetails = (req, res) => {

    const { username, shopname, service, id, price} = req.params;

    console.log(username, shopname, service, id);

    // const url = `https://localhost:4000/6346ffb7e4b1955ab3c8c75c`;

    res.render('services/service-details', {username, shopname, service, id, price});
}

const proceedPage = async (req, res) => {

    const { username, shopname, service, id, price} = req.params;
    console.log(username,shopname,service,id, price);

    const user = await User.findOne({ username })
    const shopDetail = await Business.findOne({ id })
    
    // console.log(user);
    // console.log(shopDetail);

    const address1 = user.addressName +', '+ user.apartmentName +', ' + user.areaName +', ' + user.city +', ' + user.state +'.';
    console.log(address1);

    const address2 = user.addressName2 +', '+ user.apartmentName2 +', ' + user.areaName2 +', ' + user.city2 +', ' + user.state2 +'.';
    console.log(address2);

    res.render('services/proceed', { username, id, service, shopname, price, address1, address2 });
}

const proceedPage_post = async (req, res) => {

    const { sn,pc,sr,username,id } = req.body;
    console.log('POST: ',sn,pc,sr,username,id);

    const user = await User.findOne({ username });
    const shopDetail = await Business.findOne({ id });

    const order = {
        'shopname':sn,
        'service':sr,
        'price':pc,
        'time': Date.now(),
    }
    const updateUserOrder = {order1: order};
    await user.updateOne(updateUserOrder);

    const updatedUser = await User.findById(user._id);
    console.log(updatedUser);

    const userOrderDetail = {
        'username': username,
        'service': sr,
    }

    res.status(200).json();
}

module.exports = {
    servicesDashboard,
    shopList_get,
    shopList_post,
    serviceDetails,
    proceedPage,
    proceedPage_post
}