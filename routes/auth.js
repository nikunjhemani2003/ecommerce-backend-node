const express = require('express');

const isLogged = require('../middleware/is-logged');
const router = express.Router();
const authControllers=require('../controllers/auth')


router.get('/login',authControllers.getLogin);

router.post('/login',authControllers.postLogin);

router.post('/logout',authControllers.postLogout);

router.get('/signup',authControllers.getSignup);

router.post('/signup',authControllers.postSignup);

router.get('/reset', isLogged, authControllers.getReset);

router.get('/reset/:resetToken', authControllers.getNewPassword);

router.post('/reset', isLogged, authControllers.postReset);

router.post('/new-password', isLogged, authControllers.postNewPassword);


module.exports = router;