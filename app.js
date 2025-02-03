const path = require('path');
const mongoose=require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash=require('connect-flash');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

process.env.NODE_NO_WARNINGS = 1;


    var store = new MongoDBStore({
        uri: 'mongodb+srv://nikunjhemani2424:GjjG8zblahI3oa7G@cluster0.2j1iv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0',
        collection: 'sessions'
    });

    store.on('error', function(error) {
        console.log(error);
    });

const app = express();


const errorsController = require('./controllers/errors.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User=require('./models/user.js');

const csrfProtection = csrf();
app.use(flash());



app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({secret:"my secret",resave:false,saveUninitialized:false,store: store,})
);

app.use(csrfProtection);

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

mongoose.connect("mongodb+srv://nikunjhemani2424:GjjG8zblahI3oa7G@cluster0.2j1iv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0")
    .then(result=>{
        console.log("Connected");
            app.listen(3000);
    })
.catch(err=>console.log(err));

