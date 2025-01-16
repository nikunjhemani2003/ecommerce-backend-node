const User=require('../models/user');
const bcrypt=require('bcryptjs');

module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn 

    });
};
module.exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
        .then(user => {
            if(!user){
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
                    res.redirect('/login');
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
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn
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
        })
    })
    .catch(err=>console.log(err));
};  

