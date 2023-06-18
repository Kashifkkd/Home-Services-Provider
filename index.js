const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const servicesRoutes = require('./routes/servicesRoutes.js')
const serviceProvidersRoutes = require('./routes/serviceProvidersRoutes.js')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser, checkUserBusiness } = require('./middleware/authMiddleware')
const User = require('./models/User')

app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
dotenv.config();
 
// connecting database
mongoose.connect(process.env.DATABASE_URL)
    .then((result) => {
        console.log('Connected to DB.');
    }).catch((err) => {
        console.log(err.message);
    }); 

app.get('*', checkUser);

app.get('/', (req, res) => {

    res.render('index.ejs');
});

// app.get('/services', requireAuth, async (req,res) => {
//     res.render('main.ejs');
// });

app.use(authRoutes);
app.use(userRoutes);
app.use(servicesRoutes);
app.use(serviceProvidersRoutes);

app.use((req, res) => {
    res.render('404-error');
});

app.listen(3000);