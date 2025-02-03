const User=require('../models/user');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const sendMail = require('../util/mail');

module.exports.getLogin = (req, res, next) => {
    let message=req.flash('error');
    if(message.length>0){
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn ,
        errorMessage:message
    });
};
module.exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
        .then(user => {
            if(!user){
                req.flash('error','Invalid email or password');
                return res.redirect('/login');
            }
            // console.log(password,user.password);
            bcrypt.compare(password,user.password)
            .then(match=>{
                if(match){
                    req.session.isLoggedIn=true;
                    req.session.user=user
                    req.session.save((err)=>{
                        console.log(err);
                        res.redirect('/');
                    })
                }
                else{
                    req.flash('error','Invalid email or password');
                    return res.redirect('/login');
                }
            })
            .catch(err=>{
                console.log(err);
                res.redirect('/login');
            })
        })
        .catch(err => console.log(err));
    
};

module.exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    })
};
module.exports.getSignup = (req, res, next) => {
    let message=req.flash('error');
    if(message.length>0){
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage:message
    });
};
module.exports.postSignup = (req, res, next) => {
    const name=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    User.findOne({email:email})
    .then(userdoc=>{
        if(userdoc){
            req.flash('error','Email already exists');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user=new User({
                name:name,
                email:email,
                password:hashedPassword,
                cart:{items:[]}
            })
            return user.save();
    
        })
        .then(result=>{
            res.redirect('/login');
            return sendMail({
                to: email,
                subject: 'Signup Succeeded!',
                html: '<p>You successfully signed up!</p>'
            });
        })
    })
    .catch(err=>console.log(err));
};  

module.exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length === 0) message = null;
    res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message
    })
};

module.exports.getNewPassword = (req, res, next) => {
    const token = req.params.resetToken;
    User
        .findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        })
        .then(user => {
            if(user) {
                let message = req.flash('error');
                if(message.length === 0) message = null;
                res.render('auth/new-password', {
                    pageTitle: 'New Password',
                    path: '/new-password',
                    errorMessage: message,
                    resetToken: token,
                    userId: user._id.toString()
                });
            } else {
                req.flash('error', 'Something went wrong. Please try again later.');
                res.redirect('/login');
            }
        })
        .catch(err => console.log(err));
};

module.exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User
            .findOne({ email: req.body.email })
            .then(user => {
                if(!user) {
                    req.flash('error', 'No account with that email found.');
                    res.redirect('/reset');
                    return null;
                }
                console.log(token);
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + (60 * 60 * 1000);
                return user.save();
            })
            .then(result => {
                if(result) {
                    res.redirect('/');
                    return sendMail({
                        to: req.body.email,
                        subject: 'Password Reset',
                        html: `
                            <p>You requested a password reset.</p>
                            <p>Click this link to set a new password:</p>
                            <a href="http://localhost:3000/reset/${token}">Reset Password</a>
                        `
                    });
                }
            })
            .catch(err => console.log(err));
    });
};


module.exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const resetToken = req.body.resetToken;
    User
        .findOne({
            _id: userId,
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() }
        })
        .then(user => {
            if(user) {
                bcrypt
                    .hash(password, 12)
                    .then(hashedPassword => {
                        user.password = hashedPassword;
                        user.resetToken = null;
                        user.resetTokenExpiration = undefined;
                        return user.save();
                    })
                    .then(result => {
                        sendMail({
                            to: user.email,
                            subject: 'Password Reset Success',
                            html: `
                                <p>Your password has been reset successfully at ${new Date(Date.now()).toString()}</p>
                            `
                        });
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};


// module.exports.postReset = (req,res,next)=>{
//     const email=req.body.email;
//     const password=req.body.password;
//     const confirmPassword=req.body.confirmPassword;
    
// }
